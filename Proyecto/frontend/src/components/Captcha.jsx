import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import '../styles/Captcha.css';

export default function Captcha({ onChange }) {
  const [pregunta, setPregunta] = useState('');
  const [token,    setToken]    = useState('');
  const [respuesta,setRespuesta]= useState('');

  const cargarCaptcha = async () => {
    setRespuesta('');
    const data = await api.get('/auth/captcha-gen');
    if (data.ok) { setPregunta(data.pregunta); setToken(data.token); }
  };

  useEffect(() => { cargarCaptcha(); }, []);

  const handleChange = (e) => {
    setRespuesta(e.target.value);
    onChange({ captchaToken: token, captchaRespuesta: e.target.value });
  };

  return (
    <div className="captcha">
      <label className="captcha__label">Verificación de seguridad</label>
      <div className="captcha__row">
        <span className="captcha__pregunta">{pregunta}</span>
        <input className="captcha__input" type="number" value={respuesta}
          onChange={handleChange} placeholder="Resp." min="0" max="99" />
        <button type="button" onClick={cargarCaptcha} className="captcha__refresh" title="Nueva pregunta">↻</button>
      </div>
    </div>
  );
}
