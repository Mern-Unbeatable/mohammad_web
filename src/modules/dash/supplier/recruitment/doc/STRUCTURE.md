# Supplier recruitment — structure

Supplier job pages: public job posts (`/supplier/recruitment`), the supplier's
own posts (`/supplier/recruitment/my-jobs`), the job page with applying or,
for the owner, applied candidates (`/supplier/recruitment/:jobId`), and the
create / edit form (`/supplier/recruitment/create`, `…/:jobId/edit`).
Data comes from `@/features/dash/supplier/recruitment`
(`state.supplierRecruitment`).

The layout mirrors `modules/dash/user/recruitment`, and reuses its public
building blocks (`RecruitmentToolbar`, `JobsSectionHeader`, `JobPostForm`,
`JobPosterCard`, `AppliedCandidatesPanel`, `buildMyJobsQuery`, `jobCount`,
`matchesStatusFilter`, `nextJobStatus`). The supplier version differs in:

- filters live in page state, not the URL; no employment / workplace filters
  and no list / grid toggle;
- applying calls `recruitmentApi.applyToJob` directly, and the owner view does
  not mark applications as seen;
- Cancel in the apply form is disabled while submitting.

## Folder layout

```
recruitment/
├── pages/
│   ├── SupplierRecruitmentView.jsx  Header, section header, public jobs, pagination
│   ├── SupplierMyJobsView.jsx       Header, status tabs, own jobs, pagination, delete modal
│   ├── SupplierJobDetailView.jsx    Loading / not found, job card, notices, apply form, poster + candidates
│   └── SupplierPostJobView.jsx      Back link, loading or the job form
│
├── index.js                         Public API: JOB_BASE, MY_JOBS_PATH, jobDetailPath
│
├── constant/
│   └── constants.js                 Routes, view ids, page size, debounce, default filters, header text
│
├── components/
│   ├── layout/
│   │   ├── RecruitmentHeader.jsx    PanelPageHeader + shared search / level toolbar
│   │   ├── RecruitmentActions.jsx   Public Job Posts / My Job Posts / Post Job
│   │   └── BackLink.jsx
│   ├── jobs/
│   │   ├── PublicJobsList.jsx       Skeleton, empty state or job cards
│   │   ├── MyJobsList.jsx           Own job cards with edit / delete / open-close
│   │   ├── JobsEmptyState.jsx
│   │   └── DeleteJobModal.jsx       Names the job title and company
│   ├── detail/
│   │   ├── ApplyForm.jsx            Cover letter + submit / cancel
│   │   └── JobNotices.jsx           Closed notice, "application submitted"
│   └── form/
│       ├── JobFormCard.jsx          Create / edit heading + shared JobPostForm
│       └── JobFormLoading.jsx
│
├── hooks/
│   ├── useJobSearch.js              Debounced search, level, page (shared by both lists)
│   ├── useJobsList.js               Store jobs as card models, totals, error toast
│   ├── usePublicJobs.js             Public list fetch
│   ├── useMyJobs.js                 Own list fetch, status tabs, open / close, delete, page refill
│   ├── useJobDetail.js              Fetch by id, not-found tracking, owner applications
│   ├── useApplyToJob.js             Apply form state and submit
│   └── useJobForm.js                Load for edit, field changes, logo upload, validation, save
│
├── utils/
│   ├── jobsQuery.js                 buildJobsQuery, isUnfiltered, pagesAfterRemoval
│   └── jobForm.js                   JOB_LEVEL_OPTIONS, emptyJobForm, jobPayloadError
│
├── test/
│   ├── recruitmentUtils.test.js
│   └── RecruitmentViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch or toast.
- Hooks own Redux access, API calls and toasts; utils are pure.
- "Not found" is tracked per id (`missingId === jobId`), so it resets when
  the id changes without a `setState` in an effect.
