export default function Loading(){
    return(
        <div>
            <div className="flex items-center max-h-screen">
                <p>Loading the information
                <div className="flex space-x-2 mt-6">
                <div className="w-6 h-6 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0s', animationDuration: '1.5s'}}></div>
                <div className="w-6 h-6 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></div>
                <div className="w-6 h-6 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '1s', animationDuration: '1.5s'}}></div>
              </div>
              </p>
            </div>
        </div>
    )
}