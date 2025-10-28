import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          PinAutomate
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <LoginForm />
      </main>
    </div>
  )
}
