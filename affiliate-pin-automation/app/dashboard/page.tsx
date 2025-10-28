import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import LinkSubmissionForm from '@/components/dashboard/LinkSubmissionForm'
import ManualPinForm from '@/components/dashboard/ManualPinForm'
import PinGallery from '@/components/dashboard/PinGallery'
import StatsCards from '@/components/dashboard/StatsCards'
import CreatePinTabs from '@/components/dashboard/CreatePinTabs'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage your Pinterest pins
          </p>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Pin Creation Options */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Pin</h2>
          <CreatePinTabs />
        </div>

        {/* Recent Pins */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Pins</h2>
          <PinGallery />
        </div>
      </div>
    </DashboardLayout>
  )
}
