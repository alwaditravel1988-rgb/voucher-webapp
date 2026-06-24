import { redirect } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Link from 'next/link';

async function createVoucher(formData: FormData) {
  'use server';
  if (!(await isLoggedIn())) redirect('/');
  const payload = {
    voucher_no: '',
    guest_name: String(formData.get('guest_name') || '').trim(),
    guest_nationality: String(formData.get('guest_nationality') || '').trim() || null,
    guest_phone: String(formData.get('guest_phone') || '').trim() || null,
    adults: Number(formData.get('adults') || 1),
    children: Number(formData.get('children') || 0),
    hotel_name: String(formData.get('hotel_name') || '').trim(),
    hotel_address: String(formData.get('hotel_address') || '').trim() || null,
    destination: String(formData.get('destination') || '').trim() || null,
    check_in: String(formData.get('check_in') || ''),
    check_out: String(formData.get('check_out') || ''),
    room_type: String(formData.get('room_type') || '').trim(),
    board_basis: String(formData.get('board_basis') || 'RO'),
    number_of_rooms: Number(formData.get('number_of_rooms') || 1),
    supplier_name: String(formData.get('supplier_name') || '').trim() || null,
    supplier_confirmation_no: String(formData.get('supplier_confirmation_no') || '').trim() || null,
    booking_reference: String(formData.get('booking_reference') || '').trim() || null,
    special_notes: String(formData.get('special_notes') || '').trim() || null,
    internal_notes: String(formData.get('internal_notes') || '').trim() || null
  };
  if (!payload.guest_name || !payload.hotel_name || !payload.check_in || !payload.check_out || !payload.room_type) {
    throw new Error('Missing required fields');
  }
  const { data, error } = await supabaseAdmin.from('vouchers').insert(payload).select('id').single();
  if (error) throw new Error(error.message);
  redirect(`/vouchers/${data.id}`);
}

async function logout() {
  'use server';
  const { clearLoginCookie } = await import('@/lib/auth');
  await clearLoginCookie();
  redirect('/');
}

export default async function Home() {
  const logged = await isLoggedIn();
  if (!logged) return <Login />;

  const { data: vouchers } = await supabaseAdmin
    .from('vouchers')
    .select('id,voucher_no,guest_name,hotel_name,check_in,check_out,status,created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <main className="container">
      <div className="topbar">
        <div>
          <div className="brand">Voucher System</div>
          <div className="sub">إصدار فواوتشر فنادق وسفر محفوظة في Supabase</div>
        </div>
        <form action={logout}><button className="btn light">خروج</button></form>
      </div>

      <section className="card">
        <h2>إصدار Voucher جديد</h2>
        <form action={createVoucher}>
          <div className="grid3">
            <div className="field"><label>اسم العميل *</label><input name="guest_name" required /></div>
            <div className="field"><label>الجنسية</label><input name="guest_nationality" /></div>
            <div className="field"><label>تليفون العميل</label><input name="guest_phone" /></div>
          </div>
          <div className="grid3">
            <div className="field"><label>Adults</label><input type="number" name="adults" min="0" defaultValue="1" /></div>
            <div className="field"><label>Children</label><input type="number" name="children" min="0" defaultValue="0" /></div>
            <div className="field"><label>عدد الغرف</label><input type="number" name="number_of_rooms" min="1" defaultValue="1" /></div>
          </div>
          <div className="grid">
            <div className="field"><label>اسم الفندق *</label><input name="hotel_name" required /></div>
            <div className="field"><label>الوجهة / المدينة</label><input name="destination" /></div>
          </div>
          <div className="field"><label>عنوان الفندق</label><input name="hotel_address" /></div>
          <div className="grid3">
            <div className="field"><label>Check-in *</label><input type="date" name="check_in" required /></div>
            <div className="field"><label>Check-out *</label><input type="date" name="check_out" required /></div>
            <div className="field"><label>Board Basis</label><select name="board_basis" defaultValue="RO"><option>RO</option><option>BB</option><option>HB</option><option>FB</option><option>AI</option></select></div>
          </div>
          <div className="grid">
            <div className="field"><label>نوع الغرفة *</label><input name="room_type" required placeholder="Over Water Villa / Deluxe Room" /></div>
            <div className="field"><label>رقم الحجز الداخلي</label><input name="booking_reference" /></div>
          </div>
          <div className="grid">
            <div className="field"><label>اسم المورد</label><input name="supplier_name" /></div>
            <div className="field"><label>Confirmation No.</label><input name="supplier_confirmation_no" /></div>
          </div>
          <div className="field"><label>ملاحظات تظهر في الفاوتشر</label><textarea name="special_notes" /></div>
          <div className="field"><label>ملاحظات داخلية لا تظهر للعميل</label><textarea name="internal_notes" /></div>
          <div className="actions"><button className="btn gold">إصدار وطباعة Voucher</button></div>
        </form>
      </section>

      <section className="card" style={{marginTop:20}}>
        <h2>آخر الفواوتشر</h2>
        <table className="table">
          <thead><tr><th>Voucher</th><th>العميل</th><th>الفندق</th><th>التواريخ</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            {(vouchers || []).map(v => (
              <tr key={v.id}>
                <td>{v.voucher_no}</td><td>{v.guest_name}</td><td>{v.hotel_name}</td><td>{v.check_in} → {v.check_out}</td><td><span className="badge">{v.status}</span></td><td><Link className="btn light" href={`/vouchers/${v.id}`}>فتح</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function Login() {
  return (
    <main className="login">
      <div className="card">
        <h1>دخول النظام</h1>
        <p className="sub">اكتب الباسورد لإصدار الفواوتشر</p>
        <LoginForm />
      </div>
    </main>
  );
}

function LoginForm() {
  async function login(formData: FormData) {
    'use server';
    const password = String(formData.get('password') || '');
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || password !== expected) throw new Error('Invalid password');
    const { createSessionToken, setLoginCookie } = await import('@/lib/auth');
    await setLoginCookie(createSessionToken());
    redirect('/');
  }
  return <form action={login}><div className="field"><label>Password</label><input name="password" type="password" required /></div><div className="actions"><button className="btn gold">دخول</button></div></form>;
}
