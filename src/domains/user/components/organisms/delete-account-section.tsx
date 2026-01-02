'use client';

import { useState, useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteAccount } from '../../actions';
import { USER_MESSAGES } from '../../user.text-map';
import { DangerZoneCard } from '../molecules/danger-zone-card';
import { ConfirmationInput } from '../molecules/confirmation-input';

/**
 * Account deletion section with multi-step confirmation
 * Uses DangerZoneCard for visual hierarchy
 */
export function DeleteAccountSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!isConfirmed) {
      toast.error(USER_MESSAGES.DELETE.MISMATCH_ERROR);
      return;
    }

    const formData = new FormData();
    formData.append('confirmation', confirmation);

    startTransition(async () => {
      const result = await deleteAccount(formData);

      if (!result.success) {
        toast.error(result.error || USER_MESSAGES.ERROR.DELETE_FAILED);
      }
      // Success case handled by redirect in action
    });
  };

  const resetDialog = () => {
    setConfirmation('');
    setIsConfirmed(false);
    setIsDialogOpen(false);
  };

  return (
    <DangerZoneCard className="mt-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {USER_MESSAGES.DELETE.HEADING}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {USER_MESSAGES.DELETE.DESCRIPTION}
          </p>
        </div>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              {USER_MESSAGES.DELETE.BUTTON_DELETE}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                {USER_MESSAGES.DELETE.WARNING_TITLE}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4 pt-2">
                <p className="font-medium text-slate-700">
                  {USER_MESSAGES.DELETE.WARNING_DESC}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>{USER_MESSAGES.DELETE.WARNING_ITEM_1}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>{USER_MESSAGES.DELETE.WARNING_ITEM_2}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>{USER_MESSAGES.DELETE.WARNING_ITEM_3}</span>
                  </li>
                  <li className="flex gap-2 font-semibold text-red-700">
                    <span className="text-red-500">•</span>
                    <span>{USER_MESSAGES.DELETE.WARNING_ITEM_4}</span>
                  </li>
                </ul>

                {/* Confirmation input */}
                <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                  <p className="mb-3 text-sm font-medium text-red-900">
                    {USER_MESSAGES.DELETE.CONFIRM_DESCRIPTION}
                  </p>
                  <ConfirmationInput
                    expectedText="ELIMINAR"
                    label={USER_MESSAGES.DELETE.CONFIRM_LABEL}
                    placeholder={USER_MESSAGES.DELETE.CONFIRM_PLACEHOLDER}
                    value={confirmation}
                    onChange={setConfirmation}
                    onMatch={setIsConfirmed}
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel onClick={resetDialog} disabled={isPending}>
                {USER_MESSAGES.DELETE.CANCEL_BUTTON}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={!isConfirmed || isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {isPending
                  ? USER_MESSAGES.LOADING.DELETING_ACCOUNT
                  : USER_MESSAGES.DELETE.CONFIRM_BUTTON}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DangerZoneCard>
  );
}
