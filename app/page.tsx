import { landingHtml } from '@/lib/landing-html';
import Enhancers from '@/components/Enhancers';

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: landingHtml }} />
      <Enhancers />
    </>
  );
}
