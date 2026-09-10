const STATUSES = ['unknown','scheduled','open','full','closed','ended','postponed','cancelled'];
const STATUS = {
  unknown: ['申込方法・受付開始日は後日公開','開催情報を見る','#information','申込方法等の詳細は、日程が近づきましたら公式案内で公開されます。'],
  scheduled: ['受付開始前','申込開始の案内を見る','#information','受付開始日時が正式に確認できた場合のみ掲載します。'],
  open: ['申込受付中','10月学校説明会に申し込む',null,'正式な申込ページへ移動します。受付状況は正式申込ページでご確認ください。'],
  full: ['定員に達しました','今後の開催予定を見る','#upcoming','キャンセル待ちは正式な仕組みが確認できる場合のみ案内します。'],
  closed: ['申込受付は終了しました','今後の開催予定を見る','#upcoming','11月・12月の開催予定をご確認ください。'],
  ended: ['10月学校説明会は終了しました','今後の開催予定を見る','#upcoming','11月・12月の開催予定をご確認ください。'],
  postponed: ['開催延期・詳細は案内をご確認ください','開催に関するお知らせを見る',null,'最新情報は学校の公式案内をご確認ください。'],
  cancelled: ['開催中止','開催に関するお知らせを見る',null,'最新情報は学校の公式案内をご確認ください。']
};

export const esc = (v='') => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const ok = (c,m) => { if (!c) throw new Error(m); };

function safeUrl(v,label,allowTel=false) {
  if (!v) return;
  const raw = String(v);
  if (allowTel && raw.startsWith('tel:')) return;
  if (/^https:\/\//i.test(raw)) return;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(raw) && !raw.startsWith('//') && !raw.includes('..')) return;
  throw new Error(`${label}: HTTPSまたは安全な相対パスを使用してください`);
}

export function validateData({eventsData,contentData,photosData,site}) {
  ok(Array.isArray(eventsData.events) && eventsData.events.length,'events[] が必要です');
  ok(eventsData.events.some(e => e.id === eventsData.primaryEventId),'primaryEventId が見つかりません');
  for (const e of eventsData.events) {
    ok(e.timezone === 'Asia/Tokyo',`${e.id}: timezone は Asia/Tokyo`);
    ok(STATUSES.includes(e.application?.status),`${e.id}: status が不正です`);
    if (e.date) ok(/^\d{4}-\d{2}-\d{2}$/.test(e.date),`${e.id}: date形式が不正です`);
    safeUrl(e.application?.url,`${e.id}: application.url`);
    safeUrl(e.application?.noticeUrl,`${e.id}: noticeUrl`);
    if (e.application?.status === 'open') {
      const required = {date:e.date,receptionTime:e.receptionTime,startTime:e.startTime,venue:e.venue,audience:e.audience,url:e.application.url,opensAt:e.application.opensAt,closesAt:e.application.closesAt,checkedAt:e.application.checkedAt,conditionsSummary:e.application.conditionsSummary};
      for (const [k,v] of Object.entries(required)) ok(v,`${e.id}: open には ${k} が必須です`);
    }
    if (['postponed','cancelled'].includes(e.application?.status)) ok(e.application.noticeUrl,`${e.id}: noticeUrl が必要です`);
  }
  ok(Array.isArray(contentData.sections),'content.sections[] が必要です');
  for (const s of contentData.sections) ok(['draft','approved'].includes(s.approvalStatus),`${s.sectionId}: approvalStatus が不正です`);
  ok(Array.isArray(photosData.photos),'photos[] が必要です');
  for (const p of photosData.photos) {
    ok(['pending','approved','rejected'].includes(p.publicationStatus),`${p.id}: publicationStatus が不正です`);
    safeUrl(p.src,`${p.id}: src`);
    Object.values(p.variants || {}).forEach(v => safeUrl(v,`${p.id}: variant`));
  }
  safeUrl(site.officialUrl,'officialUrl');
  safeUrl(site.meetingInfoUrl,'meetingInfoUrl');
  safeUrl(site.contact?.href,'contact.href',true);
  ok(['preview','production'].includes(site.publishMode),'publishMode が不正です');
}

function jstDate(now) {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const x = Object.fromEntries(parts.map(v => [v.type,v.value]));
  return `${x.year}-${x.month}-${x.day}`;
}

export function resolveStatus(event,now=new Date()) {
  const status = event.application.status;
  if (['postponed','cancelled'].includes(status)) return status;
  if (event.date && jstDate(now) > event.date) return 'ended';
  if (status === 'open' && event.application.opensAt && now < new Date(event.application.opensAt)) return 'scheduled';
  if (status === 'open' && event.application.closesAt && now > new Date(event.application.closesAt)) return 'closed';
  return status;
}

export function applicationView(event,status) {
  const [label,cta,baseHref,helper] = STATUS[status];
  const href = status === 'open' ? event.application.url : ['postponed','cancelled'].includes(status) ? (event.application.noticeUrl || '#information') : baseHref;
  return {label,cta,href,helper};
}

export function dateView(event) {
  if (!event.date) return {short:`${event.year}年${event.month}月`,full:'日程の詳細は後日公開',iso:'',weekday:''};
  const [y,m,d] = event.date.split('-').map(Number);
  const weekday = new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',weekday:'short'}).format(new Date(`${event.date}T00:00:00+09:00`));
  return {short:`${m}.${String(d).padStart(2,'0')}`,full:`${y}年${m}月${d}日（${weekday}）`,iso:event.date,weekday};
}
