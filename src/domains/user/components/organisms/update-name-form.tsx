'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { updateDisplayName } from '../../actions';
import { updateNameSchema, type UpdateNameFormValues } from '../../schemas';
import { USER_MESSAGES } from '../../user.text-map';
import { cn } from '@/lib/utils';

interface UpdateNameFormProps {
  currentName: string | null;
}

/**
 * Inline name editing form
 * Desktop: Inline edit, Mobile: Full form
 */
export function UpdateNameForm({ currentName }: UpdateNameFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateNameFormValues>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: currentName || ''
    }
  });

  const onSubmit = async (data: UpdateNameFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);

    startTransition(async () => {
      const result = await updateDisplayName(formData);

      if (result.success) {
        toast.success(USER_MESSAGES.SUCCESS.NAME_UPDATED);
        setIsEditing(false);
      } else {
        toast.error(result.error || USER_MESSAGES.ERROR.NAME_UPDATE_FAILED);
      }
    });
  };

  const handleCancel = () => {
    reset({ name: currentName || '' });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {USER_MESSAGES.NAME.HEADING}
            </CardTitle>
            <CardDescription className="mt-1">
              {USER_MESSAGES.NAME.HINT}
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{USER_MESSAGES.NAME.LABEL}</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={USER_MESSAGES.NAME.PLACEHOLDER}
                disabled={isPending}
                className={cn(
                  'transition-all',
                  errors.name && 'border-red-500 focus-visible:ring-red-500'
                )}
                autoFocus
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
              <p className="text-xs text-slate-500">
                {USER_MESSAGES.NAME.MIN_LENGTH} -{' '}
                {USER_MESSAGES.NAME.MAX_LENGTH}
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending} className="gap-2">
                <Check className="h-4 w-4" />
                {USER_MESSAGES.NAME.BUTTON_SAVE}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                {USER_MESSAGES.NAME.BUTTON_CANCEL}
              </Button>
            </div>
          </form>
        ) : (
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-slate-600">
              {USER_MESSAGES.NAME.LABEL}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {currentName || 'Sin nombre'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
