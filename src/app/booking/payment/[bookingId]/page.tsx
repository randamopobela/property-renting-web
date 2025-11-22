export default function PaymentPage({ params }: { params: { bookingId: string } }) {
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Halaman Pembayaran</h1>
      <p>ID Booking: {params.bookingId}</p>
      <p>Di sini form upload bukti bayar.</p>
    </div>
  );
}