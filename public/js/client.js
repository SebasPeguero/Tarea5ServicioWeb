document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCrear');
  const inputNombre = document.getElementById('inputNombre');
  const inputApellido = document.getElementById('inputApellido');
  const inputTelefono = document.getElementById('inputTelefono');
  const jsonViewer = document.getElementById('jsonViewer');
  const contactsContainer = document.getElementById('contactsContainer');
  const btnRefresh = document.getElementById('btnRefresh');
  const toast = document.getElementById('toastNotification');

  function formatPhoneNumber(val) {
    if (!val) return '';
    const startsWithPlus = val.trim().startsWith('+');
    let digits = val.replace(/\D/g, '');
    if (!digits) return startsWithPlus ? '+' : '';
    if (digits.length > 11) digits = digits.substring(0, 11);

    if (digits.length === 11 || (startsWithPlus && digits.length > 3)) {
      const country = digits.charAt(0);
      const p1 = digits.substring(1, 4);
      const p2 = digits.substring(4, 7);
      const p3 = digits.substring(7);
      let res = `+${country}`;
      if (p1) res += `-${p1}`;
      if (p2) res += `-${p2}`;
      if (p3) res += `-${p3}`;
      return res;
    }

    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.substring(0, 3)}-${digits.substring(3)}`;
    } else {
      return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6)}`;
    }
  }

  inputTelefono.addEventListener('input', () => {
    inputTelefono.value = formatPhoneNumber(inputTelefono.value);
  });

  async function fetchContacts() {
    try {
      const res = await fetch('/agenda.php');
      const data = await res.json();
      jsonViewer.textContent = JSON.stringify(data, null, 2);
      renderCards(data);
    } catch (err) {
      jsonViewer.textContent = `Error al consumir el servicio: ${err.message}`;
    }
  }

  function renderCards(list) {
    contactsContainer.innerHTML = '';
    if (!Array.isArray(list) || list.length === 0) {
      contactsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No hay contactos guardados en la agenda.</p>';
      return;
    }

    list.forEach(c => {
      const card = document.createElement('div');
      card.className = 'contact-card';

      const n = (c.nombre || '').trim();
      const a = (c.apellido || '').trim();
      const inits = (n ? n.charAt(0) : '?') + (a ? a.charAt(0) : '');

      card.innerHTML = `
        <div class="contact-avatar">${inits.toUpperCase()}</div>
        <div>
          <div class="contact-name">${n} ${a}</div>
          <div class="contact-phone">${c.telefono || ''}</div>
        </div>
      `;
      contactsContainer.appendChild(card);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const telefono = inputTelefono.value.trim();

    if (!nombre || !apellido || !telefono) {
      showToast('Todos los campos son obligatorios.', 'error');
      return;
    }

    try {
      const res = await fetch('/agenda.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, telefono })
      });

      if (!res.ok) {
        throw new Error(`Error en servidor: ${res.status}`);
      }

      showToast('Contacto almacenado exitosamente vía POST', 'success');
      form.reset();
      await fetchContacts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  btnRefresh.addEventListener('click', fetchContacts);

  function showToast(msg, type) {
    toast.textContent = msg;
    toast.className = `toast-notification show ${type}`;
    setTimeout(() => {
      toast.className = 'toast-notification';
    }, 3000);
  }

  fetchContacts();
});
