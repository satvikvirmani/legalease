import ConsumerRegisterForm from '@/app/ui/register-form-consumer';
import ProviderRegisterForm from '@/app/ui/register-form-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function Page() {

  return (
    <>
      <section
        className="relative grid w-full place-items-center min-h-screen"
      >
        <Tabs defaultValue="consumer" className="">
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value="consumer">Consumer</TabsTrigger>
            <TabsTrigger value="provider">Provider</TabsTrigger>
          </TabsList>
          <TabsContent value="consumer">
            <ConsumerRegisterForm />
          </TabsContent>
          <TabsContent value="provider">
            <ProviderRegisterForm />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
