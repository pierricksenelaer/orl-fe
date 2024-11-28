import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email(),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, {
        message:
          "Password must contain at least one letter, one number, and one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createHackathonSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name must be at most 60 characters"),
    tagline: z
      .string()
      .max(60, "Tagline must be at most 60 characters")
      .optional(),
    email: z.string().email().optional(),
    location: z
      .string()
      .max(25, "Location must be at most 25 characters")
      .optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    },
  );

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(40, "Name must be at most 40 characters"),
  pitch: z.string().max(60, "Pitch must be at most 60 characters").optional(),
  techStack: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .optional(),
  repositoryUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z
    .string()
    .url()
    .refine(
      (value) =>
        /^(?:(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|youtu.be\/|user\/\S+|playlist\?list=\S+)))([^\s\/?#]+)/.test(
          value,
        ),
      { message: "Only Vimeo or Youtube video links are acceptable." },
    )
    .optional()
    .or(z.literal("")),
});

export const editProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  pitch: z.string().optional(),
  techStack: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .optional(),
  repositoryUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z
    .string()
    .url()
    .refine(
      (value) =>
        /^(?:(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|youtu.be\/|user\/\S+|playlist\?list=\S+)))([^\s\/?#]+)/.test(
          value,
        ),
      { message: "Only Vimeo or Youtube video links are acceptable." },
    )
    .optional()
    .or(z.literal("")),
});

export const submitProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  pitch: z.string(),
  techStack: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  repositoryUrl: z.string().url(),
  videoUrl: z
    .string()
    .url()
    .refine(
      (value) =>
        /^(?:(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|youtu.be\/|user\/\S+|playlist\?list=\S+)))([^\s\/?#]+)/.test(
          value,
        ),
      { message: "Only Vimeo or Youtube video links are acceptable." },
    ),
});

export const createPrizeSchema = z.object({
  name: z.string(),
  value: z.string(),
  numberOfWinningTeams: z.string(),
  description: z.string(),
});

export const userProfileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.object({
    value: z.string(),
    label: z.string(),
  }),
  items: z.array(z.string()),
  skills: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .optional(),
});

export const inviteTeammateSchema = z.object({
  email: z.string().email(),
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;
export type TSignInSchema = z.infer<typeof signInSchema>;
export type TCreateHackathonSchema = z.infer<typeof createHackathonSchema>;
export type TCreatePrizeSchema = z.infer<typeof createPrizeSchema>;
export type TUserProfileSchema = z.infer<typeof userProfileSchema>;
export type TCreateProjectSchema = z.infer<typeof createProjectSchema>;
export type TEditProjectSchema = z.infer<typeof editProjectSchema>;
export type TSubmitProjectSchema = z.infer<typeof submitProjectSchema>;
export type TInviteTeammateSchema = z.infer<typeof inviteTeammateSchema>;
export type Hackathon = {
  about: null;
  company: null;
  createdAt: Date;
  creatorId: string;
  description: string;
  endDate: string;
  id: string;
  judges: string;
  launched: boolean;
  location: string;
  managerEmail: string;
  name: string;
  partners: string;
  prizes: any[];
  requirements: string;
  resources: string;
  rules: string;
  startDate: string;
  tagline: string;
  timeZone: string;
  updatedAt: Date;
  isJoined?: boolean;
  hasProject?: boolean;
  projectId?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  image?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  userPreference: {
    id: string;
    role: string | null;
    skills: string[] | null;
    avatar: string | null;
    company: string | null;
  };
};

export type Prize = {
  id: string;
  name: string;
  value: string;
  numberOfWinningTeams: string;
  description: string;
  isEditing?: boolean;
};

export type Project = {
  id: string;
  name: string;
  pitch: string;
  hackathon: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    timeZone: string;
  };
  participants: [];
  creatorId: string;
  creator?: {
    id: string;
    name: string;
    userPreference: {
      avatar: string;
    };
  };
  isSubmitted: boolean;
  videoUrl: string;
};

export type Notification = {
  id: string;
  category: string;
  contentId: string;
  contentName: string;
  content?: string;
  createdAt: string;
  isAccepted: boolean;
  isViewed: boolean;
  recevierEmail: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    userPreference: {
      avatar: string;
    };
  };
  updatedAt: string;
  hackathon?: {
    id: string;
    name: string;
  };
};

export type Participant = {
  id: string;
  name: string;
  userPreference: {
    role:
    | {
      value: string;
      label: string;
    }
    | any;
    skills: any | null;
    avatar: string | null;
    company: string | null;
  } | null;
};

//todo add number of characters limit to name and tagline
