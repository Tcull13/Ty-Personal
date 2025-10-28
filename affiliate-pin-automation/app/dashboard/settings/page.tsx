import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SettingsContent from '@/components/dashboard/SettingsContent'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account and integrations
          </p>
        </div>

        <SettingsContent />
      </div>
    </DashboardLayout>
  )
}
