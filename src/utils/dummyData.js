export const events = [
  {
    _id: '1',
    title: 'Annual Tech Symposium',
    date: '2025-08-20',
    time: '10:00',
    location: 'Main Auditorium',
    category: 'Workshop',
    description: 'Join us for a day of cutting-edge technology discussions and hands-on workshops.',
    participants: [
      { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
    ]
  },
  {
    _id: '2',
    title: 'Cultural Night 2025',
    date: '2025-08-25',
    time: '18:00',
    location: 'College Amphitheater',
    category: 'Cultural',
    description: 'A celebration of diversity through music, dance, and art performances.',
    participants: [
      { id: '4', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: '5', name: 'Tom Brown', avatar: 'https://i.pravatar.cc/150?img=5' },
    ],
    images: [
      'https://picsum.photos/800/600?random=3',
      'https://picsum.photos/800/600?random=4',
    ]
  },
  {
    _id: '3',
    title: 'Basketball Tournament',
    date: '2025-09-01',
    time: '14:00',
    location: 'Sports Complex',
    category: 'Sports',
    description: 'Inter-college basketball tournament finals.',
    participants: [
      { id: '6', name: 'Alex Thompson', avatar: 'https://i.pravatar.cc/150?img=6' },
      { id: '7', name: 'Chris Davis', avatar: 'https://i.pravatar.cc/150?img=7' },
    ],
    images: [
      'https://picsum.photos/800/600?random=5',
      'https://picsum.photos/800/600?random=6',
    ]
  },
];

export const categoryColors = {
  Sports: 'bg-blue-500',
  Workshop: 'bg-purple-500',
  Seminar: 'bg-green-500',
  Cultural: 'bg-orange-500',
};

export const pastEvents = [
  ...events,
  {
    _id: '4',
    title: 'Science Fair 2025',
    date: '2025-07-15',
    category: 'Workshop',
    images: [
      'https://picsum.photos/800/600?random=7',
      'https://picsum.photos/800/600?random=8',
    ]
  },
  {
    _id: '5',
    title: 'Graduation Ceremony',
    date: '2025-07-01',
    category: 'Cultural',
    images: [
      'https://picsum.photos/800/600?random=9',
      'https://picsum.photos/800/600?random=10',
    ]
  },
];
