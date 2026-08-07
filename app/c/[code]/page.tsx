import { sql } from '@/lib/db';
import { ensureCouponsTable } from '@/lib/coupons';
import CouponValidate from '@/components/CouponValidate';
import Icon from '@/components/Icon';

export const dynamic = 'force-dynamic';

export default async function CouponScanPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  await ensureCouponsTable();
  const rows = (await sql`
    select reward_name, status, (expires_at is not null and expires_at <= now()) as expired
    from coupons where code = ${code} limit 1
  `) as { reward_name: string; status: string; expired: boolean }[];
  const coupon = rows[0];

  return (
    <main className="scan-page">
      <div className="scan-card">
        <span className="brand"><span className="porthole" />Wash<span className="amp">&amp;</span>eat</span>
        {!coupon ? (
          <div className="scan-state err">
            <Icon name="check" className="scan-ic" />
            <h1>Coupon introuvable</h1>
            <p>Ce code n’existe pas.</p>
          </div>
        ) : coupon.status !== 'active' ? (
          <div className="scan-state err">
            <Icon name="check" className="scan-ic" />
            <h1>Déjà utilisé</h1>
            <p>Ce coupon a déjà été validé.</p>
          </div>
        ) : coupon.expired ? (
          <div className="scan-state err">
            <Icon name="check" className="scan-ic" />
            <h1>Coupon expiré</h1>
            <p>Ce coupon a dépassé ses 2 semaines de validité.</p>
          </div>
        ) : (
          <CouponValidate code={code} rewardName={coupon.reward_name} />
        )}
      </div>
    </main>
  );
}
