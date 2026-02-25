import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900">OmniCare AI</h1>
        <p className="text-lg text-slate-600">
          State-of-the-art customer care chatbot with dynamic UI generation.
          <br />
          Powered by Vercel AI SDK 6 + json-render.
        </p>

        <div className="grid gap-4 max-w-sm mx-auto pt-4">
          <Link
            href="/chat/demo"
            className="block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors"
          >
            Try Demo Chat
          </Link>

          <div className="text-sm text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">Try asking:</p>
            <ul className="text-left space-y-1">
              <li>&ldquo;Where is my order ORD-7291?&rdquo;</li>
              <li>&ldquo;What headphones do you sell?&rdquo;</li>
              <li>&ldquo;What&apos;s your return policy?&rdquo;</li>
              <li>&ldquo;Show me your pricing plans&rdquo;</li>
              <li>&ldquo;I need to book a demo&rdquo;</li>
              <li>&ldquo;I want to return my order ORD-7145&rdquo;</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-slate-400 pt-8">
          Built with Next.js 16 &middot; React 19 &middot; Vercel AI SDK 6 &middot; json-render &middot; Gemini 2.5 Flash
        </p>
      </div>
    </div>
  );
}
