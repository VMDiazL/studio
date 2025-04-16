
import {Button} from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const SalesPage = () => {
    const router = useRouter();
  return (
       <Button onClick={() => router.push('/home')} variant="outline" className="mb-4">
        Go to Home
      </Button>
  );
};

export default SalesPage;
