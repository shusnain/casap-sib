import { useState, useCallback } from 'react'
import useDragScroll from './useDragScroll'
import {
  Signal,
  Wifi,
  BatteryFull,
  ChevronLeft,
  ChevronRight,
  X,
  Airplay,
  Settings,
  Maximize2,
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Scissors,
  Home,
  Clapperboard,
  PlusCircle,
  Bell,
  User,
  MoreVertical,
  RefreshCw,
} from 'lucide-react'

const recSets = [
  [
    {
      thumb: 'thumb-1', avatar: 'av-1', duration: '18:42',
      title: 'Why 90% of Startups Fail \u2014 A Data-Driven Post Mortem',
      meta: 'Y Combinator \u00b7 1.2M views \u00b7 3 weeks ago',
    },
    {
      thumb: 'thumb-2', avatar: 'av-2', duration: '24:15',
      title: 'Pricing Your SaaS Product: The Framework That Actually Works',
      meta: "Lenny's Podcast \u00b7 340K views \u00b7 5 days ago",
    },
    {
      thumb: 'thumb-3', avatar: 'av-3', duration: '31:07',
      title: 'From $0 to $10M ARR \u2014 How We Scaled Without Venture Capital',
      meta: 'My First Million \u00b7 567K views \u00b7 1 week ago',
    },
  ],
  [
    {
      thumb: 'thumb-2', avatar: 'av-3', duration: '22:18',
      title: 'The Fall of Rome \u2014 What Really Caused the Collapse',
      meta: 'Kings and Generals \u00b7 4.2M views \u00b7 1 month ago',
    },
    {
      thumb: 'thumb-3', avatar: 'av-1', duration: '45:21',
      title: 'D-Day: Hour by Hour \u2014 The Invasion That Changed Everything',
      meta: 'The History Channel \u00b7 2.1M views \u00b7 2 weeks ago',
    },
    {
      thumb: 'thumb-1', avatar: 'av-2', duration: '19:33',
      title: 'Medieval Knights Were Nothing Like You Think',
      meta: 'Overly Sarcastic \u00b7 890K views \u00b7 6 days ago',
    },
  ],
  [
    {
      thumb: 'thumb-3', avatar: 'av-2', duration: '28:14',
      title: 'The French Revolution \u2014 From Liberty to the Guillotine',
      meta: 'Extra History \u00b7 1.5M views \u00b7 1 week ago',
    },
    {
      thumb: 'thumb-1', avatar: 'av-3', duration: '35:47',
      title: 'Lost City of Pompeii \u2014 New Discoveries Under the Ash',
      meta: 'National Geographic \u00b7 3.8M views \u00b7 3 days ago',
    },
    {
      thumb: 'thumb-2', avatar: 'av-1', duration: '17:02',
      title: 'The Ottoman Empire at Its Peak \u2014 How They Built a Superpower',
      meta: 'History Scope \u00b7 720K views \u00b7 2 weeks ago',
    },
  ],
]

const chipSets = [
  ['All', 'Y Combinator', 'Startups', 'Fundraising', 'Product', 'Growth', 'SaaS'],
  ['All', 'Ancient Rome', 'World Wars', 'Medieval', 'Empires', 'Revolutions', 'Explorers'],
  ['All', 'Civil Rights', 'Cold War', 'Archaeology', 'Mythology', 'Renaissance', 'Dynasties'],
]

const iconProps = { strokeWidth: 1.5 }

function StatusBar() {
  return (
    <div className="status-bar">
      <span className="time">6:15</span>
      <div className="icons">
        <Signal size={12} {...iconProps} />
        <Wifi size={12} {...iconProps} />
        <BatteryFull size={12} {...iconProps} />
      </div>
    </div>
  )
}

function VideoPlayer() {
  return (
    <div className="video-player">
      <div className="thumbnail-bg">
        <div className="play-overlay" />
      </div>
      <div className="video-nav">
        <button><ChevronLeft size={18} {...iconProps} /></button>
        <button><ChevronRight size={18} {...iconProps} /></button>
      </div>
      <div className="video-top-bar">
        <div className="icon"><X size={16} {...iconProps} /></div>
        <div className="icon"><Airplay size={16} {...iconProps} /></div>
        <div className="icon"><Settings size={16} {...iconProps} /></div>
      </div>
      <div className="video-controls">
        <span>12:34</span>
        <div className="progress-bar"><div className="fill" /></div>
        <span>38:16</span>
        <Maximize2 size={14} {...iconProps} />
      </div>
    </div>
  )
}

function VideoInfo() {
  return (
    <div className="video-info">
      <div className="video-title">
        How to Find Product-Market Fit &mdash; Lessons from 1,000 YC Startups
      </div>
      <div className="video-meta">
        <div className="channel-avatar" />
        <span>Y Combinator &middot; 84K views &middot; 2 days ago</span>
      </div>
    </div>
  )
}

function ActionRow({ dragScroll }) {
  return (
    <div
      className="action-row"
      ref={dragScroll.ref}
      onPointerDown={dragScroll.onPointerDown}
      onPointerMove={dragScroll.onPointerMove}
      onPointerUp={dragScroll.onPointerUp}
      style={dragScroll.style}
    >
      <button className="action-btn"><ThumbsUp size={14} {...iconProps} /> 3.8K</button>
      <button className="action-btn"><ThumbsDown size={14} {...iconProps} /></button>
      <button className="action-btn"><Share size={14} {...iconProps} /> Share</button>
      <button className="action-btn"><Download size={14} {...iconProps} /> Download</button>
      <button className="action-btn"><Scissors size={14} {...iconProps} /> Clip</button>
    </div>
  )
}

function FilterChips({ chips }) {
  return chips.map((label) => (
    <button key={label} className={`chip${label === 'All' ? ' active' : ''}`}>
      {label}
    </button>
  ))
}

function SkeletonCard() {
  return (
    <div className="rec-card">
      <div className="rec-thumb">
        <div className="thumb-bg skeleton-shimmer" />
      </div>
      <div className="rec-detail">
        <div className="ch-avatar skeleton-shimmer" />
        <div className="rec-text">
          <div className="skeleton-line skeleton-shimmer" style={{ width: '85%' }} />
          <div className="skeleton-line skeleton-shimmer" style={{ width: '60%', marginTop: 6 }} />
        </div>
      </div>
    </div>
  )
}

function RecCard({ thumb, avatar, duration, title, meta }) {
  return (
    <div className="rec-card">
      <div className="rec-thumb">
        <div className={`thumb-bg ${thumb}`} />
        <div className="duration">{duration}</div>
      </div>
      <div className="rec-detail">
        <div className={`ch-avatar ${avatar}`} />
        <div className="rec-text">
          <div className="title">{title}</div>
          <div className="meta">{meta}</div>
        </div>
        <div className="more-btn"><MoreVertical size={16} {...iconProps} /></div>
      </div>
    </div>
  )
}

function BottomNav() {
  return (
    <div className="bottom-nav">
      <div className="nav-item active">
        <Home size={20} {...iconProps} />
        <span>Home</span>
      </div>
      <div className="nav-item">
        <Clapperboard size={20} {...iconProps} />
        <span>Shorts</span>
      </div>
      <div className="nav-item">
        <PlusCircle size={28} {...iconProps} />
      </div>
      <div className="nav-item">
        <Bell size={20} {...iconProps} />
        <span>Subscriptions</span>
      </div>
      <div className="nav-item">
        <User size={20} {...iconProps} />
        <span>You</span>
      </div>
    </div>
  )
}

export default function PhoneMockup({ variant }) {
  const isA = variant === 'A'
  const [setIndex, setSetIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleRefresh = useCallback(() => {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      setSetIndex((i) => (i + 1) % recSets.length)
      setLoading(false)
    }, 1200)
  }, [loading])

  const recs = recSets[setIndex]
  const chips = chipSets[setIndex]
  const actionDragScroll = useDragScroll()
  const filterDragScroll = useDragScroll()

  return (
    <div className="variant-wrapper">
      <div className="variant-label">
        {isA ? 'Option A \u2014 Refresh Chip' : 'Option B \u2014 Inline Label'}
      </div>
      <div className="phone-frame">
        <StatusBar />
        <VideoPlayer />
        <VideoInfo />
        <ActionRow dragScroll={actionDragScroll} />
        <div className="divider" />

        {isA ? (
          <div className="filter-bar-split">
            <div
              className="filter-chips-scroll"
              ref={filterDragScroll.ref}
              onPointerDown={filterDragScroll.onPointerDown}
              onPointerMove={filterDragScroll.onPointerMove}
              onPointerUp={filterDragScroll.onPointerUp}
              style={filterDragScroll.style}
            >
              <FilterChips chips={chips} />
            </div>
            <button
              className="refresh-chip-pinned"
              title="Refresh recommendations"
              onClick={handleRefresh}
            >
              <RefreshCw size={16} {...iconProps} className={loading ? 'spinning' : ''} />
            </button>
          </div>
        ) : (
          <>
            <div className="refresh-label" onClick={handleRefresh}>
              <span>Refresh suggestions</span>
              <span className="refresh-icon">
                <RefreshCw size={15} {...iconProps} className={loading ? 'spinning' : ''} />
              </span>
            </div>
            <div
              className="filter-bar"
              ref={filterDragScroll.ref}
              onPointerDown={filterDragScroll.onPointerDown}
              onPointerMove={filterDragScroll.onPointerMove}
              onPointerUp={filterDragScroll.onPointerUp}
              style={filterDragScroll.style}
            >
              <FilterChips chips={chips} />
            </div>
          </>
        )}

        <div className="recs-scroll">
          {loading
            ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
            : recs.map((rec, i) => <RecCard key={i} {...rec} />)
          }
        </div>

        <BottomNav />
      </div>
    </div>
  )
}
