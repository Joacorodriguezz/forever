import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ComprobantePage.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '../service/api';

const decisionSchema = yup.object({
  motivo: yup.string().trim().min(5, 'Especificá un motivo (≥ 5 caracteres)').required('El motivo es obligatorio para rechazar')
});

export default function ComprobantePage() {
  const { id } = useParams();          // id = cuotaId
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [cuota, setCuota] = useState(null);
  const [socio, setSocio] = useState(null);
  const [comprobantes, setComprobantes] = useState([]);
  const [selectedCompId, setSelectedCompId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(decisionSchema),
    defaultValues: { motivo: '' }
  });

  const compActivo = useMemo(
    () => comprobantes.find(c => c.activo) || comprobantes[0] || null,
    [comprobantes]
  );

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErrorMsg('');
        const { data } = await api.get(`/api/cuotas/${id}`);
        setCuota(data ? { mes: data.mes, monto: data.monto, estado: data.estado } : null);
        setSocio(data ? { nombre: data.socioNombre, apellido: '' } : null);
        const compDb = data?.comprobanteUrl ? [{ id: 1, url: data.comprobanteUrl, activo: true, created_at: new Date().toISOString() }] : [];
        setComprobantes(compDb);
        setSelectedCompId(compDb[0]?.id ?? null);
      } catch (err) {
        console.error(err);
        setErrorMsg('No se pudo cargar el comprobante. Intentá nuevamente.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAprobar = async () => {
    if (!selectedCompId) {
      setErrorMsg('Seleccioná un comprobante para aprobar');
      return;
    }
    try {
      setSaving(true);
      setErrorMsg('');
      await api.patch(`/api/cuotas/${id}/estado`, { estado: 'Aprobada'});
      alert('Comprobante aprobado ✔');
      navigate('/cuotas-admin', { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo aprobar el comprobante.');
    } finally {
      setSaving(false);
    }
  };

  const onRechazar = async ({ motivo }) => {
    try {
      setSaving(true);
      setErrorMsg('');
      await api.patch(`/api/cuotas/${id}/estado`, { estado: 'Rechazada', motivo });
      alert('Comprobante rechazado ✖');
      navigate('/cuotas-admin', { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo rechazar el comprobante.');
    } finally {
      setSaving(false);
      reset({ motivo: '' });
    }
  };

  if (loading) return <div className="p-4">Cargando…</div>;
  if (errorMsg) return <div className="p-4 text-danger">{errorMsg}</div>;
  if (!cuota) return <div className="p-4">No se encontró la cuota</div>;

  const nombreSocio = (socio?.nombre || socio?.apellido)
    ? `${socio?.nombre ?? ''} ${socio?.apellido ?? ''}`.trim()
    : (socio?.dni ? `Socio DNI ${socio.dni}` : `Socio #${cuota.socioId || cuota.socio_id}`);

  const imgUrl = (comprobantes.find(c => c.id === selectedCompId)?.url) || compActivo?.url || '';
  const isPdf = imgUrl?.toLowerCase().endsWith('.pdf');
  const resolvedImgUrl = imgUrl && !/^https?:/i.test(imgUrl) ? (api.defaults.baseURL || '') + imgUrl : imgUrl;

  return (
    <div className="comprobante-page">
      <div className="comprobante-container">
        <h3>Comprobante de {nombreSocio}</h3>
        <p>Mes: {cuota.mes || '—'} — Monto: ${cuota.monto ?? '—'}</p>

        {comprobantes.length > 1 && (
          <div className="mb-3">
            <label className="form-label">Seleccionar comprobante</label>
            <select
              className="form-select"
              value={selectedCompId || ''}
              onChange={(e) => setSelectedCompId(Number(e.target.value))}
            >
              {comprobantes.map(c => (
                <option key={c.id} value={c.id}>
                  #{c.id} · {new Date(c.created_at || c.createdAt).toLocaleString('es-AR')} {c.activo ? ' (activo)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {imgUrl ? (
          isPdf ? (
            <div className="mb-3">
              <a href={resolvedImgUrl} target="_blank" rel="noreferrer">
                Ver comprobante (PDF)
              </a>
            </div>
          ) : (
            <img
              src={resolvedImgUrl}
              alt="Comprobante"
              className="imagen-comprobante"
              referrerPolicy="no-referrer"
            />
          )
        ) : (
          <div className="text-muted mb-3">No hay comprobantes subidos para esta cuota.</div>
        )}


        <div className="botones-comprobante">
          <button className="btn btn-success" onClick={handleAprobar} disabled={saving || comprobantes.length === 0}>
            Aprobar
          </button>

          <form onSubmit={handleSubmit(onRechazar)} className="d-inline-block ms-2">
            <div className="d-flex align-items-start" style={{ gap: 8 }}>
              <input
                className={`form-control ${errors.motivo ? 'is-invalid' : ''}`}
                placeholder="Motivo del rechazo"
                {...register('motivo')}
                style={{ width: 260 }}
              />
              <button className="btn btn-danger" type="submit" disabled={saving}>
                Rechazar
              </button>
            </div>
            {errors.motivo && <div className="invalid-feedback d-block">{errors.motivo.message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
