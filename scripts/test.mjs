import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { build } from './build.mjs';
import { applicationView, resolveStatus, validateData } from './lib/model.mjs';

const now = new Date('2026-09-10T20:45:00+09:00');
const result = await build({ now });
assert.match(result.html, /東京都立目黒高等学校/);
assert.match(result.html, /2026年10月24日（土）/);
assert.match(result.html, /14:30〜/);
assert.match(result.html, /体育館/);
assert.match(result.html, /申込方法・受付開始日は後日公開/);
assert.ok(!result.html.includes('target="_blank"'));
assert.ok(!result.html.includes('href="#"'));

const heroMonth = result.html.indexOf('2026年10月 学校説明会');
const heroDate = result.html.indexOf('event-date');
const heroCopy = result.html.indexOf('hero-title');
const heroCta = result.html.indexOf('data-hero-cta');
const heroPhoto = result.html.indexOf('data-hero-media');
assert.ok(heroMonth < heroDate && heroDate < heroCopy && heroCopy < heroCta && heroCta < heroPhoto, 'スマホHeroのDOM順が仕様と一致しません');

const baseEvent = {
  id: 'test', year: 2026, month: 10, date: '2026-10-24', timezone: 'Asia/Tokyo',
  receptionTime: '14:00', startTime: '14:30', venue: '体育館', audience: '中学生・保護者',
  application: {
    status: 'unknown', url: 'https://example.com/apply', opensAt: '2026-09-01T09:00:00+09:00',
    closesAt: '2026-10-23T17:00:00+09:00', checkedAt: '2026-09-10T20:00:00+09:00',
    noticeUrl: 'https://example.com/notice', conditionsSummary: '事前申込制'
  }
};
for (const status of ['unknown','scheduled','open','full','closed','ended','postponed','cancelled']) {
  const event = structuredClone(baseEvent);
  event.application.status = status;
  assert.equal(resolveStatus(event, now), status);
  const view = applicationView(event, status);
  assert.ok(view.label && view.cta && view.href);
}

const beforeOpen = structuredClone(baseEvent);
beforeOpen.application.status = 'open';
beforeOpen.application.opensAt = '2026-10-01T09:00:00+09:00';
assert.equal(resolveStatus(beforeOpen, now), 'scheduled');

const afterClose = structuredClone(baseEvent);
afterClose.application.status = 'open';
assert.equal(resolveStatus(afterClose, new Date('2026-10-23T18:00:00+09:00')), 'closed');

const afterEvent = structuredClone(baseEvent);
afterEvent.application.status = 'closed';
assert.equal(resolveStatus(afterEvent, new Date('2026-10-25T09:00:00+09:00')), 'ended');

const badEvents = { primaryEventId: 'bad', events: [{ ...structuredClone(baseEvent), id: 'bad', receptionTime: null, application: { ...structuredClone(baseEvent.application), status: 'open' } }] };
assert.throws(() => validateData({ eventsData: badEvents, contentData: { sections: [] }, photosData: { photos: [] }, site: { publishMode: 'preview', officialUrl: 'https://example.com', meetingInfoUrl: 'https://example.com/meeting', contact: { href: 'tel:0312345678' } } }), /open には/);

const dist = await fs.readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.match(dist, /href="assets\/style\.css"/);
assert.match(dist, /src="assets\/app\.js"/);
console.log('All tests passed');
