import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const form = document.getElementById('leadForm');
const statusEl = document.getElementById('formStatus');
const WHATSAPP_NUMBER = '18292786677';

function normalizePhone(phone = '') {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) return `1${digits}`;
  return digits;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.textContent = 'Enviando solicitud...';
  statusEl.className = 'form-status';

  const formData = new FormData(form);
  const rawLead = Object.fromEntries(formData.entries());
  const telefonoNormalizado = normalizePhone(rawLead.telefono || rawLead.whatsapp);
  const leadId = `modular_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const crmLead = {
    id: leadId,
    nombre: rawLead.nombre || '',
    name: rawLead.nombre || '',
    telefono: rawLead.telefono || '',
    phone: rawLead.telefono || '',
    whatsapp: rawLead.whatsapp || rawLead.telefono || '',
    telefonoNormalizado,
    zona: rawLead.zona || '',
    ubicacion: rawLead.zona || '',
    tieneSolar: rawLead.tieneSolar || '',
    tamanoSolar: rawLead.tamanoSolar || '',
    modelo: rawLead.modelo || 'Quiero que me recomienden',
    presupuesto: rawLead.presupuesto || '',
    mensaje: rawLead.mensaje || '',
    message: rawLead.mensaje || '',
    proyecto: 'Casas Modulares Casa Raíz',
    tipoLead: 'casas-modulares',
    origen: 'landing-casas-modulares',
    fuente: 'Landing Page - Casas Modulares',
    status: 'nuevo',
    estado: 'nuevo',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    userAgent: navigator.userAgent,
    pageUrl: window.location.href
  };

  try {
    await setDoc(doc(db, 'leads', leadId), crmLead);
    await setDoc(doc(db, 'leads_modulares', leadId), crmLead);

    statusEl.textContent = 'Solicitud enviada. Te contactaremos pronto por WhatsApp.';
    statusEl.className = 'form-status ok';

    const text = encodeURIComponent(`Hola, soy ${crmLead.nombre}. Quiero cotizar una casa modular Casa Raíz. Provincia: ${crmLead.zona}. Modelo: ${crmLead.modelo}.`);
    setTimeout(() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank'), 600);
    form.reset();
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'No se pudo enviar. Revisa las reglas de Firestore o escríbenos por WhatsApp.';
    statusEl.className = 'form-status error';
  }
});
