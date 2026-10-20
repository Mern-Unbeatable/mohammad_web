/**
 * Demo conversations for the developer component catalog only.
 * Real inboxes load data from the messages API.
 */
export const directChats = [
  {
    id: 'marcus-weber',
    name: 'Dr. Marcus Weber',
    subtitle: 'Research Scientist · BioTech GmbH',
    initials: 'MW',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&crop=face',
    avatarClass: 'bg-[#E8F3FB] text-primary',
    time: '10:42',
    preview: 'That would be excellent. We are evaluating a similar approach…',
    unread: 2,
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'Hi Élise, are you still working on the HPLC validation for the new API method?',
        time: '10:15',
      },
      {
        id: 'm2',
        from: 'me',
        text: 'Yes, I am running the intermediate precision study this week on our Shimadzu platform.',
        time: '10:18',
      },
      {
        id: 'm3',
        from: 'them',
        text: 'Great. Do you use compendial or custom methods?',
        time: '10:21',
      },
      {
        id: 'm4',
        from: 'me',
        text: 'We developed a custom method — I can share the protocol if helpful.',
        time: '10:35',
      },
      {
        id: 'm5',
        from: 'them',
        text: 'That would be excellent. We are evaluating a similar approach for our stability programme.',
        time: '10:42',
      },
    ],
  },
  {
    id: 'isabelle-fontaine',
    name: 'Isabelle Fontaine',
    subtitle: 'QA Manager · PharmaLab Lyon',
    initials: 'IF',
    avatarClass: 'bg-green-secondary text-green-primary',
    time: 'Yesterday',
    preview: 'The audit checklist you shared was very helpful.',
    unread: 0,
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'The audit checklist you shared was very helpful.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'james-thornton',
    name: 'James Thornton',
    subtitle: 'Lab Director · SynLab UK',
    initials: 'JT',
    avatarClass: 'bg-pink-secondary text-pink-light',
    time: 'Mon',
    preview: 'Are you attending the GMP conference in Brussels?',
    unread: 0,
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'Are you attending the GMP conference in Brussels?',
        time: 'Mon',
      },
    ],
  },
];

export const groupChats = [
  {
    id: 'microbiology-network',
    name: 'Microbiology Network EU',
    initials: 'M',
    avatarClass: 'bg-green-secondary text-green-primary',
    time: '11:05',
    preview: 'Anna: Has anyone validated rapid sterility methods for small batches?',
    unread: 5,
    subtitle: '248 members',
    messages: [
      {
        id: 'g1',
        from: 'them',
        sender: 'Anna K.',
        text: 'Has anyone validated rapid sterility methods for small batches?',
        time: '10:50',
      },
      {
        id: 'g2',
        from: 'me',
        text: 'We are piloting a growth-based rapid method — happy to share our protocol.',
        time: '11:02',
      },
      {
        id: 'g3',
        from: 'them',
        sender: 'Peter L.',
        text: 'That would be great. We are preparing a change control for Q4.',
        time: '11:05',
      },
    ],
  },
  {
    id: 'qc-professionals',
    name: 'Quality Control Professionals',
    initials: 'Q',
    avatarClass: 'bg-[#E8F3FB] text-primary',
    time: 'Yesterday',
    preview: 'New FDA draft guidance on analytical procedures — thoughts?',
    unread: 0,
    subtitle: '512 members',
    messages: [
      {
        id: 'g1',
        from: 'them',
        sender: 'Sarah M.',
        text: 'New FDA draft guidance on analytical procedures — thoughts?',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'lab-equipment-exchange',
    name: 'Lab Equipment Exchange',
    initials: 'L',
    avatarClass: 'bg-[#FEF3E8] text-[#E67E22]',
    time: 'Mon',
    preview: 'Selling a Sorvall centrifuge — Ghent area.',
    unread: 0,
    subtitle: '189 members',
    messages: [
      {
        id: 'g1',
        from: 'them',
        sender: 'Thomas V.',
        text: 'Selling a Sorvall centrifuge — Ghent area.',
        time: 'Mon',
      },
    ],
  },
];
