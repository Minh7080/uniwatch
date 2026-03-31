import * as lucide from 'lucide-react';

export const emotions = [
  { 
    key: 'joy',
    name: 'Joy',
    icon: lucide.Smile,
  },
  { 
    key: 'anticipation',
    name: 'Anticipation',
    icon: lucide.Eye,
  },
  { 
    key: 'disgust',
    name: 'Disgust',
    icon: lucide.XCircle,
  },
  { 
    key: 'fear',
    name: 'Fear',
    icon: lucide.AlertTriangle,
  },
  { 
    key: 'love',
    name: 'Love',
    icon: lucide.Heart,
  },
  { 
    key: 'optimism',
    name: 'Optimism',
    icon: lucide.TrendingUp,
  },
  { 
    key: 'pessimism',
    name: 'Pessimism',
    icon: lucide.TrendingDown,
  },
  { 
    key: 'sadness',
    name: 'Sadness',
    icon: lucide.Frown,
  },
  { 
    key: 'surprise',
    name: 'Surprise',
    icon: lucide.Zap,
  },
  { 
    key: 'trust',
    name: 'Trust',
    icon: lucide.ShieldCheck,
  },
] as const;
