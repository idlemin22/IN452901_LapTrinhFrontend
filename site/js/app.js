const API_URL = 'http://localhost:4000';

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

const searchForm = document.querySelector('#search-form');
const keywordInput = document.querySelector('#keyword');
const statusEl = document.querySelector('#status');
const eventList = document.querySelector('#event-list');

const formatSeats = (event) => {
  const left = event.capacity - event.registeredCount;
  return left <= 0 ? 'Hết chỗ' : `Còn ${left}/${event.capacity} chỗ`;
};

const renderEvents = (events) => {
  const cards = events.map((event) => {
    const card = document.createElement('article');
    card.setAttribute('class', 'card');

    const img = document.createElement('img');
    img.setAttribute('src', 'img/event.svg');
    img.setAttribute('alt', event.name);

    const title = document.createElement('h2');
    const link = document.createElement('a');
    link.setAttribute('href', `event-detail.html?id=${event.id}`);
    link.textContent = event.name;
    title.appendChild(link);

    const timeWrap = document.createElement('p');
    const time = document.createElement('time');
    time.setAttribute('datetime', event.startTime);
    time.textContent = formatDateTime(event.startTime);
    timeWrap.appendChild(time);

    const loc = document.createElement('p');
    loc.textContent = event.location;

    const seatsText = formatSeats(event);
    const seats = document.createElement('p');
    seats.setAttribute('class', seatsText === 'Hết chỗ' ? 'seats full' : 'seats');
    seats.textContent = seatsText;

    card.append(img, title, timeWrap, loc, seats);
    return card;
  });

  eventList.replaceChildren(...cards);
};

const loadEvents = async (keyword = '') => {
  statusEl.textContent = 'Đang tải…';

  const params = new URLSearchParams({ pageSize: '50' });
  const q = keyword.trim();
  if (q) params.set('q', q);

  try {
    const response = await fetch(`${API_URL}/api/events?${params}`);
    if (!response.ok) throw new Error();

    const data = await response.json();
    const items = data.items || [];

    renderEvents(items);
    statusEl.textContent = items.length
      ? `Tìm thấy ${items.length} sự kiện`
      : 'Không có sự kiện nào khớp từ khoá.';
  } catch {
    eventList.replaceChildren();
    statusEl.textContent = 'Không tải được dữ liệu, vui lòng thử lại.';
  }
};

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loadEvents(keywordInput.value.trim());
});

loadEvents();
