# Supplier recruitment — structure

Supplier job pages, with the same features as `modules/dash/user/recruitment`:

- **Public job posts** (`/supplier/recruitment`): search, level, employment
  and workplace filters kept in the URL (`?page=&level=&type=&workplace=&q=`),
  list / grid toggle, and retry on error.
- **My job posts** (`/supplier/recruitment/my-jobs`): search, status tabs,
  open / close, delete, new-application badges per job, and **My
  Applications** (Applied / Cancelled, with withdrawing).
- **Job page** (`/supplier/recruitment/:jobId`): apply in-app or via an
  external link, closed notice, poster card. The owner sees the applied
  candidates, which are then marked as seen.
- **Create / edit** (`/supplier/recruitment/create`, `…/:jobId/edit`).

Data comes from `@/features/dash/supplier/recruitment`
(`state.supplierRecruitment`), which mirrors the user slice (apply, withdraw,
my applications, new-application counts). Presentational pieces are reused
from `@/modules/dash/user/recruitment` with supplier links passed in
(`jobHref`, `editHref`). Pages render inside the supplier panel shell
(`PanelPage`, `PanelPageHeader`). The sidebar's Recruitment item shows the
unseen-application count (`SupplierLayout`).

## Folder layout

```
recruitment/
├── pages/
│   ├── SupplierRecruitmentView.jsx  Header + filters, section header + view toggle, jobs, pagination
│   ├── SupplierMyJobsView.jsx       Header + status tabs, Post Job, own jobs, My Applications, modals
│   ├── SupplierJobDetailView.jsx    Loading / not found, job card, closed notice, apply form, poster + candidates
│   └── SupplierPostJobView.jsx      Back link, loading or the job form
│
├── index.js                         Public API: JOB_BASE, MY_JOBS_PATH, jobDetailPath
│
├── constant/
│   └── constants.js                 Routes, page sizes, view-mode storage key, debounce, header text
│
├── components/
│   ├── layout/
│   │   ├── RecruitmentHeader.jsx    PanelPageHeader + shared RecruitmentToolbar
│   │   ├── RecruitmentActions.jsx   Public Job Posts / My Job Posts (new-application badge)
│   │   └── (BackLink: @/components/layout/BackLink)
│   └── form/
│       ├── JobFormCard.jsx          Create / edit heading + shared JobPostForm
│       └── JobFormLoading.jsx
│
├── hooks/
│   ├── usePublicJobs.js             URL filters, debounced search, page clamp, fetch
│   ├── useMyJobs.js                 Own jobs: search, status tab, open / close, delete, page refill
│   ├── useMyApplications.js         Applied / Cancelled tab and withdrawing
│   ├── useJobDetail.js              Fetch by id, not found, owner applications (marked seen)
│   ├── useApplyToJob.js             Apply form state and submit
│   └── useJobForm.js                Load for edit, field changes, logo upload, validation, save
│
├── utils/
│   ├── applications.js              toApplicationModel
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
- Shared user components default to user routes, so always pass the supplier
  `jobHref` / `editHref`.
