import { isLoggedIn } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import type { Voucher } from '@/lib/types';

export default async function VoucherPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isLoggedIn())) redirect('/');
  const { id } = await params;

  const { data: voucher, error } = await supabaseAdmin
    .from('vouchers')
    .select('*')
    .eq('id', id)
    .single<Voucher>();

  const { data: settings } = await supabaseAdmin
    .from('voucher_settings')
    .select('*')
    .limit(1)
    .single();

  if (error || !voucher) notFound();

  return (
    <>
      <div className="print-actions">
        <Link className="btn light" href="/">رجوع</Link>
        <button className="btn gold" onClick={() => window.print()}>Print / PDF</button>
      </div>
      <article className="voucher" dir="ltr">
        <header className="voucher-head">
          <div>
            <div className="voucher-title">HOTEL VOUCHER</div>
            <div className="sub">{settings?.company_name || 'Travel Voucher System'}</div>
            {settings?.company_name_ar ? <div className="sub">{settings.company_name_ar}</div> : null}
          </div>
          <div style={{textAlign:'right'}}>
            <div className="voucher-no">{voucher.voucher_no}</div>
            <div className="sub">Issue Date: {voucher.issue_date}</div>
            <div><span className="badge">{voucher.status.toUpperCase()}</span></div>
          </div>
        </header>

        <section className="info">
          <div className="box">
            <h3>Guest Details</h3>
            <div className="row"><span>Guest Name</span><strong>{voucher.guest_name}</strong></div>
            <div className="row"><span>Nationality</span><strong>{voucher.guest_nationality || '-'}</strong></div>
            <div className="row"><span>Phone</span><strong>{voucher.guest_phone || '-'}</strong></div>
            <div className="row"><span>Pax</span><strong>{voucher.adults} Adult(s), {voucher.children} Child(ren)</strong></div>
          </div>
          <div className="box">
            <h3>Booking Details</h3>
            <div className="row"><span>Booking Ref.</span><strong>{voucher.booking_reference || '-'}</strong></div>
            <div className="row"><span>Supplier</span><strong>{voucher.supplier_name || '-'}</strong></div>
            <div className="row"><span>Confirmation No.</span><strong>{voucher.supplier_confirmation_no || '-'}</strong></div>
            <div className="row"><span>Destination</span><strong>{voucher.destination || '-'}</strong></div>
          </div>
        </section>

        <section className="info">
          <div className="box">
            <h3>Hotel Details</h3>
            <div className="row"><span>Hotel</span><strong>{voucher.hotel_name}</strong></div>
            <div className="row"><span>Address</span><strong>{voucher.hotel_address || '-'}</strong></div>
            <div className="row"><span>Room Type</span><strong>{voucher.room_type}</strong></div>
            <div className="row"><span>Rooms</span><strong>{voucher.number_of_rooms}</strong></div>
          </div>
          <div className="box">
            <h3>Stay Details</h3>
            <div className="row"><span>Check-in</span><strong>{voucher.check_in}</strong></div>
            <div className="row"><span>Check-out</span><strong>{voucher.check_out}</strong></div>
            <div className="row"><span>Nights</span><strong>{voucher.nights}</strong></div>
            <div className="row"><span>Board Basis</span><strong>{voucher.board_basis}</strong></div>
          </div>
        </section>

        {voucher.special_notes ? <section className="box" style={{marginTop:16}}><h3>Special Notes</h3><p>{voucher.special_notes}</p></section> : null}

        <section className="terms">
          <strong>Terms & Conditions:</strong><br />
          {settings?.terms || 'This voucher is issued based on supplier confirmation. Amendments and cancellation are subject to supplier policy.'}
        </section>

        <footer className="terms" style={{borderTop:'1px solid #e8ded0',paddingTop:14}}>
          {settings?.phone ? <>Phone: {settings.phone} &nbsp; </> : null}
          {settings?.whatsapp ? <>WhatsApp: {settings.whatsapp} &nbsp; </> : null}
          {settings?.email ? <>Email: {settings.email}</> : null}
        </footer>
      </article>
    </>
  );
}
