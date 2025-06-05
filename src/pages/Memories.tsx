import React, { useState, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import Masonry from 'react-masonry-css';
import { ChevronLeft, ChevronRight, X, Loader2, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { MemoryRound, formatDate } from '@/types/memories';

interface MemoryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  date?: string;
  location?: string;
}

// Mock data for all rounds
const useRoundsData = (): MemoryRound[] => {
  return useMemo(() => [
    {
      id: 'round-1',
      title: 'First Round: 2023 Summer Gathering',
      description: 'Our first gathering where we began building a strong foundation in faith and fellowship for teenagers in Hawassa, Ethiopia.',
      date: '2023-08-15',
      images: Array.from({ length: 27 }, (_, i) => ({
        id: `1-${i + 1}`,
        src: `/images/memories/round-1/image-${String(i + 1).padStart(2, '0')}.jpg`,
        alt: `First round event photo ${i + 1}`,
        width: 1200,
        height: 900,
        caption: `First Round - Moment ${i + 1}`,
        date: '2023-08-15',
        location: 'Hawassa, Ethiopia'
      }))
    },
    {
      id: 'round-2',
      title: 'Second Round: 2024 Winter Retreat',
      description: 'A spiritual retreat focused on deepening faith and building Christian character among our youth members.',
      date: '2024-02-20',
      images: Array.from({ length: 26 }, (_, i) => ({
        id: `2-${i + 1}`,
        src: `/images/memories/round-2/image-${String(i + 1).padStart(2, '0')}.jpg`,
        alt: `Second round event photo ${i + 1}`,
        width: 1200,
        height: 900,
        caption: `Second Round - Moment ${i + 1}`,
        date: '2024-02-20',
        location: 'Hawassa, Ethiopia'
      }))
    },
    {
      id: 'round-3',
      title: 'Third Round: 2024 Summer Bible Camp',
      description: 'A summer filled with Bible study, worship, and fellowship as we grew together in faith and service.',
      date: '2024-07-15',
      images: Array.from({ length: 27 }, (_, i) => ({
        id: `3-${i + 1}`,
        src: `/images/memories/round-3/image-${String(i + 1).padStart(2, '0')}.jpg`,
        alt: `Third round event photo ${i + 1}`,
        width: 1200,
        height: 900,
        caption: `Third Round - Moment ${i + 1}`,
        date: '2024-07-15',
        location: 'Hawassa, Ethiopia'
      }))
    },
    {
      id: 'round-4',
      title: 'Fourth Round: 2025 Winter Discipleship',
      description: 'Our most recent gathering focused on discipleship and preparing young believers to be strong witnesses in their communities.',
      date: '2025-02-15',
      images: Array.from({ length: 24 }, (_, i) => ({
        id: `4-${i + 1}`,
        src: `/images/memories/round-4/image-${String(i + 1).padStart(2, '0')}.jpg`,
        alt: `Fourth round event photo ${i + 1}`,
        width: 1200,
        height: 900,
        caption: `Fourth Round - Moment ${i + 1}`,
        date: '2025-02-15',
        location: 'Hawassa, Ethiopia'
      }))
    },
    {
      id: 'round-5',
      title: 'Fifth Round: 2025 Summer Program',
      description: 'Our upcoming summer program - stay tuned for more details about this exciting new chapter in our ministry!',
      date: '2025-08-15',
      images: [{
        id: '5-coming-soon',
        src: '/images/coming-soon.jpg',
        alt: 'Coming soon - stay tuned for our next gathering',
        width: 1200,
        height: 900,
        caption: 'Coming Soon - Stay Tuned!',
        date: '2025-08-15',
        location: 'Hawassa, Ethiopia'
      }]
    }
  ], []);
};

const getRandomHeight = () => {
  const heights = [300, 350, 400, 450, 500];
  return heights[Math.floor(Math.random() * heights.length)];
};

const Memories = () => {
  const { theme } = useTheme();
  const roundsData = useRoundsData();
  const [selectedRound, setSelectedRound] = useState<MemoryRound | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeRound, setActiveRound] = useState<string>('all');
  const [expandedRounds, setExpandedRounds] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const { ref: roundRef, inView: roundInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  // Check if a round has images
  const hasImages = (round: MemoryRound) => round.images && round.images.length > 0;

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }));
  }, []);

  const openLightbox = (round: MemoryRound, index: number) => {
    setSelectedRound(round);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const toggleRoundExpand = (roundId: string) => {
    setExpandedRounds(prev => ({
      ...prev,
      [roundId]: !prev[roundId]
    }));
  };

  const renderRoundHeader = (round: MemoryRound) => {
    const isExpanded = expandedRounds[round.id] || false;

    return (
      <div className="w-full">
        <div 
          className="flex flex-col md:flex-row md:items-center justify-between mb-6 cursor-pointer"
          onClick={() => toggleRoundExpand(round.id)}
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">{round.title}</h2>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">{formatDate(round.date)}</span>
              {round.images[0]?.location && (
                <>
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{round.images[0].location.split(',')[0]}</span>
                </>
              )}
              <span className="mx-2">•</span>
              <span className="text-sm">{round.images.length} photos</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground self-start md:self-center mt-2 md:mt-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleRoundExpand(round.id);
            }}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
        </div>
      </div>
    );
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setSelectedRound(null);
  }, []);

  const filteredRounds = useMemo(() => {
    if (activeTab === 'all') {
      return roundsData;
    }
    return roundsData.filter(round => round.id === activeTab);
  }, [activeTab, roundsData]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  } as const;

  const slides = useMemo(() => 
    selectedRound?.images.map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.width,
      height: img.height,
      description: img.caption,
    })) || []
  , [selectedRound]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <a 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </a>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-4">
            የባለአደራ ትውልድ ጉዞ
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Reliving the unforgettable moments and milestones of our youth leadership journey.
            Each moment tells a unique story of growth, learning, and community.
          </p>
          
          {/* Round Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent/50'
              }`}
            >
              All Rounds
            </button>
            {roundsData.map((round) => (
              <button
                key={round.id}
                onClick={() => setActiveTab(round.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  activeTab === round.id
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-accent/50'
                }`}
              >
                {round.title.split(':')[0]}
                {!hasImages(round) && (
                  <span className="text-xs opacity-70">(Coming Soon)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {filteredRounds.map((round) => (
            <div key={round.id} ref={roundRef} className="mb-16">
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {round.title}
                      {!hasImages(round) && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          (Coming Soon)
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{formatDate(round.date)}</span>
                      {hasImages(round) && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-sm">
                            {round.images.length} {round.images.length === 1 ? 'photo' : 'photos'} available
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {round.description && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-foreground mt-2 md:mt-0"
                      onClick={() => setExpandedRounds(prev => ({ ...prev, [round.id]: !prev[round.id] }))}
                    >
                      {expandedRounds[round.id] ? 'Hide Details' : 'Show Details'}
                    </Button>
                  )}
                </div>

                {round.description && expandedRounds[round.id] && (
                  <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                    <p className="text-muted-foreground">{round.description}</p>
                  </div>
                )}
              </div>

              {/* Masonry Grid */}
              {hasImages(round) ? (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="flex w-auto -ml-4"
                  columnClassName="pl-4 bg-clip-padding"
                >
                  {round.images.map((image, index) => (
                    <div 
                      key={image.id} 
                      className="mb-4 group relative overflow-hidden rounded-lg transition-all duration-300 hover:opacity-90"
                      style={{
                        height: `${getRandomHeight()}px`,
                        minHeight: '250px'
                      }}
                    >
                      {!loadedImages[image.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 animate-pulse">
                          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                        </div>
                      )}
                      <img
                        src={image.src}
                        alt={image.alt}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          loadedImages[image.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => handleImageLoad(image.id)}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-medium line-clamp-1">{image.caption}</h3>
                        {image.location && (
                          <p className="text-sm text-white/80 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {image.location}
                          </p>
                        )}
                      </div>
                      <button 
                        className="absolute inset-0 w-full h-full"
                        onClick={() => openLightbox(round, index)}
                        aria-label={`View ${image.alt}`}
                      />
                    </div>
                  ))}
                </Masonry>
              ) : (
                <div className="bg-muted/20 rounded-xl p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Photos Coming Soon</h3>
                    <p className="text-muted-foreground text-sm">
                      We're currently curating the best moments from this event. Check back soon!
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <Lightbox
          open={lightboxOpen}
          close={closeLightbox}
          slides={slides}
          index={currentImageIndex}
          render={{
            iconPrev: () => <ChevronLeft className="text-white" />,
            iconNext: () => <ChevronRight className="text-white" />,
            iconClose: () => <X className="text-white" />,
          }}
          styles={{
            container: { backgroundColor: theme === 'dark' ? '#0f172a' : '#fff' },
          }}
        />
      </div>
    </div>
  );
};

export default Memories;
