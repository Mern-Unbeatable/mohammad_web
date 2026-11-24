# Admin recruitment — structure

Job moderation for admins: the job list (`/admin/recruitment`) with time and
level filters, paging and delete; and the job detail
(`/admin/recruitment/:jobId`) with the poster and every applicant. Data comes
from `@/features/dash/admin/recruitment` (`state.adminRecruitment`); the
applicants are fetched straight from `recruitmentApi`.

## Folder layout

```
recruitment/
├── pages/
│   ├── AdminRecruitmentView.jsx      Header with JobFilters, error banner, JobsList, pagination, delete modal
│   └── AdminJobDetailView.jsx        Skeleton / NotFound, JobDetailCard, JobSidebar
│
├── index.js                          Public API: RECRUITMENT_PATH, jobDetailPath
│
├── constant/
│   └── constants.js                  Paths (incl. admin user profile), page size, skeleton count, default filters
│
├── components/
│   ├── list/
│   │   ├── JobFilters.jsx            Time + level selects
│   │   ├── FilterSelect.jsx          Native select with chevron
│   │   ├── JobsList.jsx              Skeletons, empty message or JobCard list
│   │   └── DeleteJobModal.jsx        ConfirmModal naming the job (and company)
│   ├── detail/
│   │   └── JobSidebar.jsx            JobPosterCard + AppliedCandidatesPanel (from user/recruitment)
│   └── common/
│       └── ErrorBanner.jsx
│
├── hooks/
│   ├── useAdminJobs.js               Filters, paging, fetch, card models, delete flow + toasts
│   └── useAdminJobDetail.js          Load / clear the job, applications cached per job id
│
├── utils/
│   └── jobsQuery.js                  buildJobsQuery
│
├── test/
│   ├── jobsQuery.test.js
│   └── RecruitmentViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access, API calls and toasts; utils are pure.
- Mappers come from the `@/features/dash/admin/recruitment` index, not from
  `recruitmentMappers` directly.

## Notes

- Changing either filter resets the page in its handler instead of in a
  separate effect, which removes the `react-hooks/set-state-in-effect` lint
  error and the extra fetch with the old page.
