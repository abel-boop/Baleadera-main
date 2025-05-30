import { QrCode } from 'lucide-react';

interface ParticipantIdCardProps {
  participant: {
    id: string;
    name: string;
    age?: number;
    phone?: string;
    participant_id?: string;
    status: string;
  };
}

export const ParticipantIdCard = ({ participant }: ParticipantIdCardProps) => {
  return (
    <div 
      className="relative w-full h-[280px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl overflow-hidden shadow-lg"
      style={{
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-4 py-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-12 -translate-y-12"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-400/20 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-extrabold text-white tracking-wide">
                  ባለአደራ ትውልድ
                </h1>
                <div 
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    participant.status === 'approved' 
                      ? 'bg-green-500/90 text-white' 
                      : participant.status === 'rejected'
                      ? 'bg-red-500/90 text-white'
                      : 'bg-yellow-500/90 text-black'
                  }`}
                >
                  {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-blue-100 font-medium tracking-wider">
                  YOUTH FORUM MEMBERSHIP CARD
                </p>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-3 text-white flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-3 h-full">
          {/* Left Column */}
          <div className="space-y-3 flex flex-col">
            <div className="bg-white/10 p-3 rounded-lg flex-1 flex flex-col">
              <p className="text-blue-100 text-[10px] uppercase font-medium mb-1">Full Name</p>
              <p className="font-semibold text-sm break-words flex-1 flex items-center">
                {participant.name || 'N/A'}
              </p>
            </div>
            
            <div className="bg-yellow-500/20 p-3 rounded-lg border-l-4 border-yellow-400 flex-1 flex flex-col">
              <p className="text-yellow-100 text-[10px] uppercase font-medium mb-1">Forum ID</p>
              <p className="font-mono font-bold text-yellow-300 text-sm break-all">
                {participant.participant_id || 'Pending'}
              </p>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-3 flex flex-col">
            <div className="bg-white/10 p-3 rounded-lg flex-1 flex flex-col">
              <p className="text-blue-100 text-[10px] uppercase font-medium mb-1">Age</p>
              <p className="font-semibold flex-1 flex items-center">
                {participant.age || 'N/A'} {participant.age ? 'years' : ''}
              </p>
            </div>
            
            <div className="bg-red-500/20 p-3 rounded-lg border-l-4 border-red-400 flex-1 flex flex-col">
              <p className="text-blue-100 text-[10px] uppercase font-medium mb-1">Emergency Contact</p>
              <p className="font-semibold text-sm break-all">
                {participant.phone || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto">
        <div className="bg-gray-800 px-4 py-2">
          <div className="flex justify-between items-center text-xs text-gray-300">
            <div className="flex items-center space-x-1">
              <span>Location: Hawassa City</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <QrCode className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
