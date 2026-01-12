// Static mock data for logged-in user
export const staticUser = {
  loggedIn: true,
  userId: "user-123",
  permission: null,
  isUser: true,
};

export const staticProfile = {
  id: "user-123",
  name: "John Doe",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
};

export const staticRole = {
  role: "requestor" as const,
  isRequestor: true,
  isSatisfier: false,
};

export const staticMessagesCount = 3;

export const staticPostedJobs = [
  {
    id: "job-1",
    archived: false,
    status: "open" as const,
    title: "Frontend Developer",
  },
  {
    id: "job-2",
    archived: false,
    status: "draft" as const,
    title: "Backend Developer",
  },
  {
    id: "job-3",
    archived: true,
    status: "open" as const,
    title: "Designer",
  },
];

export const staticPackages = [
  {
    package: {
      name: "Premium",
    },
  },
];

export const Role = {
  SATISFIER: "satisfier",
  REQUESTOR: "requestor",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const DisplayRole = {
  TALENT: "talent",
  EMPLOYER: "employer",
} as const;

export type DisplayRole = (typeof DisplayRole)[keyof typeof DisplayRole];

export const CurveColors = {
  LightBlue: "#EFF8FC",
  LightGreen: "#EDF4EC",
} as const;

export type CurveColors = (typeof CurveColors)[keyof typeof CurveColors];
