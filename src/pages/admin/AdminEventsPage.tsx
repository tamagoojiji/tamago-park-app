import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import styles from './Admin.module.css';

interface EventForm {
  date: string;
  end_date: string;
  name: string;
  summary: string;
  category: string;
  status: string;
}

const emptyForm: EventForm = { date: '', end_date: '', name: '', summary: '', category: 'event', status: 'active' };

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    adminApi.events().then((res) => setEvents(res.events));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, end_date: form.end_date || undefined };
    if (editId !== null) {
      await adminApi.updateEvent(editId, data);
    } else {
      await adminApi.createEvent(data);
    }
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    load();
  };

  const startEdit = (ev: Record<string, unknown>) => {
    setForm({
      date: String(ev.date || ''),
      end_date: String(ev.end_date || ''),
      name: String(ev.name || ''),
      summary: String(ev.summary || ''),
      category: String(ev.category || 'event'),
      status: String(ev.status || 'active'),
    });
    setEditId(Number(ev.id));
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    await adminApi.deleteEvent(id);
    load();
  };

  const setField = (key: keyof EventForm, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>イベント一覧 ({events.length}件)</h2>
        <button className={styles.btn} onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm); }}>
          {showForm ? '閉じる' : '新規追加'}
        </button>
      </div>

      {showForm && (
        <form className={styles.eventForm} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <label>日付 <input type="date" value={form.date} onChange={(e) => setField('date', e.target.value)} required className={styles.input} /></label>
            <label>終了日 <input type="date" value={form.end_date} onChange={(e) => setField('end_date', e.target.value)} className={styles.input} /></label>
            <label>名前 <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} required className={styles.input} /></label>
            <label>カテゴリ
              <select value={form.category} onChange={(e) => setField('category', e.target.value)} className={styles.input}>
                <option value="event">event</option>
                <option value="private">private</option>
                <option value="other">other</option>
              </select>
            </label>
            <label>ステータス
              <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={styles.input}>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </label>
          </div>
          <label>概要 <textarea value={form.summary} onChange={(e) => setField('summary', e.target.value)} className={styles.textarea} /></label>
          <button type="submit" className={styles.submitBtn}>{editId !== null ? '更新' : '追加'}</button>
        </form>
      )}

      <table className={styles.table}>
        <thead><tr><th>ID</th><th>日付</th><th>名前</th><th>カテゴリ</th><th>ステータス</th><th></th></tr></thead>
        <tbody>
          {events.map((ev) => (
            <tr key={String(ev.id)}>
              <td>{String(ev.id)}</td>
              <td>{String(ev.date)}{ev.end_date ? `〜${String(ev.end_date)}` : ''}</td>
              <td>{String(ev.name)}</td>
              <td>{String(ev.category)}</td>
              <td>{String(ev.status)}</td>
              <td>
                <button className={styles.linkBtn} onClick={() => startEdit(ev)}>編集</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(Number(ev.id))}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
