import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import JobSeekerProfile from '@/models/JobSeekerProfile';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const body = await request.json();
    let profile = await JobSeekerProfile.findOne({ user: auth.user._id });

    if (!profile) {
      profile = new JobSeekerProfile({ user: auth.user._id });
    }

    const fields = [
      'headline',
      'about',
      'primaryRole',
      'currentCompany',
      'currentDesignation',
      'totalExperienceYears',
      'currentSalary',
      'expectedSalary',
      'noticePeriod',
      'availabilityStatus',
      'lastWorkingDay',
      'mobile',
      'currentCity',
      'openToRelocate',
      'portfolioUrl',
      'linkedinUrl',
      'githubUrl',
      'leetcodeUrl',
      'twitterUrl',
      'preferredLocations',
      'preferredJobTypes',
      'preferredWorkModes',
      'skills',
      'education',
      'experience',
      'projects',
      'certifications',
      'languages',
    ];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        profile[field] = body[field];
      }
    });

    await profile.save();

    const userUpdates: Record<string, any> = {};
    if (body.headline !== undefined) userUpdates.headline = body.headline;
    if (body.about !== undefined) userUpdates.bio = body.about;
    if (body.mobile !== undefined) userUpdates.mobile = body.mobile;
    if (body.currentCity !== undefined) userUpdates.location = body.currentCity;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(auth.user._id, userUpdates);
    }

    await profile.populate('user', 'name email mobile location avatar headline bio');

    return NextResponse.json(
      {
        success: true,
        profile,
        message: 'Profile updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
