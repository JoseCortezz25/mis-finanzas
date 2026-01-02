'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, EyeOff, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { changePassword } from '../../actions';
import {
  changePasswordSchema,
  calculatePasswordStrength,
  type ChangePasswordFormValues
} from '../../schemas';
import { USER_MESSAGES } from '../../user.text-map';
import { PasswordStrengthBar } from '../molecules/password-strength-bar';
import { cn } from '@/lib/utils';

/**
 * Change password form with strength indicator
 * Opens in dialog/modal
 */
export function ChangePasswordForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');
  const passwordStrength = calculatePasswordStrength(newPassword || '');

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const formData = new FormData();
    formData.append('currentPassword', data.currentPassword);
    formData.append('newPassword', data.newPassword);
    formData.append('confirmPassword', data.confirmPassword);

    startTransition(async () => {
      const result = await changePassword(formData);

      if (result.success) {
        toast.success(USER_MESSAGES.SUCCESS.PASSWORD_CHANGED);
        setIsOpen(false);
        reset();
        // Redirect to login after 1.5 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      } else {
        toast.error(result.error || USER_MESSAGES.ERROR.PASSWORD_CHANGE_FAILED);
      }
    });
  };

  const togglePassword = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                {USER_MESSAGES.PASSWORD.HEADING}
              </CardTitle>
              <CardDescription className="mt-1">
                {USER_MESSAGES.PASSWORD.DESCRIPTION}
              </CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Cambiar</span>
              </Button>
            </DialogTrigger>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-600">••••••••••••</p>
            <p className="mt-1 text-xs text-slate-500">
              Última actualización hace 2 meses
            </p>
          </div>
        </CardContent>
      </Card>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{USER_MESSAGES.PASSWORD.HEADING}</DialogTitle>
          <DialogDescription>
            {USER_MESSAGES.PASSWORD.DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {USER_MESSAGES.PASSWORD.WARNING}
            </AlertDescription>
          </Alert>

          {/* Current password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              {USER_MESSAGES.PASSWORD.CURRENT_LABEL}
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                {...register('currentPassword')}
                placeholder={USER_MESSAGES.PASSWORD.CURRENT_PLACEHOLDER}
                disabled={isPending}
                className={cn(
                  errors.currentPassword &&
                    'border-red-500 focus-visible:ring-red-500'
                )}
              />
              <button
                type="button"
                onClick={() => togglePassword('current')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              {USER_MESSAGES.PASSWORD.NEW_LABEL}
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                {...register('newPassword')}
                placeholder={USER_MESSAGES.PASSWORD.NEW_PLACEHOLDER}
                disabled={isPending}
                className={cn(
                  errors.newPassword &&
                    'border-red-500 focus-visible:ring-red-500'
                )}
              />
              <button
                type="button"
                onClick={() => togglePassword('new')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Password strength */}
          {newPassword && (
            <PasswordStrengthBar strength={passwordStrength.strength} />
          )}

          {/* Password requirements */}
          {newPassword && (
            <div className="space-y-1 rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-700">
                {USER_MESSAGES.PASSWORD.REQUIREMENTS_TITLE}
              </p>
              <ul className="space-y-1">
                {Object.entries(passwordStrength.requirements).map(
                  ([key, met]) => (
                    <li key={key} className="flex items-center gap-2 text-xs">
                      <Check
                        className={cn(
                          'h-3 w-3',
                          met ? 'text-green-600' : 'text-slate-300'
                        )}
                      />
                      <span
                        className={cn(
                          met ? 'text-green-700' : 'text-slate-500'
                        )}
                      >
                        {
                          USER_MESSAGES.PASSWORD[
                            `REQ_${key.toUpperCase()}` as keyof typeof USER_MESSAGES.PASSWORD
                          ]
                        }
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {USER_MESSAGES.PASSWORD.CONFIRM_LABEL}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder={USER_MESSAGES.PASSWORD.CONFIRM_PLACEHOLDER}
                disabled={isPending}
                className={cn(
                  errors.confirmPassword &&
                    'border-red-500 focus-visible:ring-red-500'
                )}
              />
              <button
                type="button"
                onClick={() => togglePassword('confirm')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isPending} className="flex-1">
              {USER_MESSAGES.PASSWORD.BUTTON_CHANGE}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
              disabled={isPending}
            >
              {USER_MESSAGES.PASSWORD.BUTTON_CANCEL}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
