'use client';

import { createRequest } from '@/app/lib/actions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export async function Form({ consumerId, providerId, providerName }: { consumerId: string | undefined, providerId: string, providerName: string }) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Request</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={createRequest} className="space-y-3">
          <DialogHeader className="mb-4">
            <DialogTitle>Create Request</DialogTitle>
            <DialogDescription>
              Create a request to connect with this provider
            </DialogDescription>
          </DialogHeader>
          <Input
            className="hidden"
            type="text"
            name="providerName"
            id="providerName"
            value={providerName}
            hidden={true}
            readOnly
          />
          
          <Input
            className="hidden"
            type="text"
            name="id"
            id="id"
            hidden={true}
            readOnly
          />
          <Input
            className="hidden"
            type="text"
            name="consumerId"
            id="consumerId"
            value={consumerId}
            hidden={true}
            readOnly
          />
          <Input
            className="hidden"
            type="text"
            name="providerId"
            id="providerId"
            value={providerId}
            hidden={true}
            readOnly
          />
          <Label htmlFor="description">Describe your request briefly</Label>
          <Textarea
            name="description"
            id="description"
            cols={30}
            rows={10}
          ></Textarea>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() =>
                toast('Creating request', {
                  description: 'Your request is being created',
                })
              }
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
