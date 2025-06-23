export default function Loading() {
  // Consistent with the light theme, though ideally Suspense fallback in PlanPage is used.
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <p className="text-gray-600">Loading your personalized plan...</p>
      {/* You could add a simple spinner here if desired */}
    </div>
  )
}
