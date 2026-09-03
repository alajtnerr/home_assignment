# Task 1: Manual Testing — "Add to Shopping List" Feature (ALDI US)

## Test Cases

Fields used for each test case:

- **ID** — unique identifier
- **Title** — short description of the scenario
- **Preconditions** — state required before executing the test
- **Test Steps** — numbered actions to perform
- **Test Data** — specific inputs used
- **Expected Result** — what should happen if the feature works correctly
- **Priority** — High / Medium / Low, based on user impact
- **Type** — Positive / Negative
- **Status** — result of executing the test: **Pass** (actual result matched expected, no bug found), **Fail** (see linked bug report), or **Blocked** (could not be executed)

---

### TC01 — Add a product to an existing saved list and verify it appears under "Your saved lists"

| Field | Value |
|---|---|
| Preconditions | User is logged in; user has already created at least one saved list |
| Test Steps | 1. On the homepage, click on a random product to open its product modal.<br>2. Click "Add to Saved List".<br>3. Select the previously created saved list from the list of options.<br>4. Click "Save to List".<br>5. Click the back arrow to return to the homepage.<br>6. Click on the user profile icon.<br>7. From the profile menu, select "Your saved lists".<br>8. Locate the saved product and increase its quantity within the saved list.<br>9. Open the cart and check whether the quantity of the same product in the cart changed. |
| Test Data | A random product selected from the homepage; an existing saved list |
| Expected Result | After saving, the product appears under the selected saved list when viewed via "Your saved lists". *(Step 8–9 outcome intentionally left open — see note below.)* |
| Priority | High |
| Type | Positive |
| Status | **Pass** — actual result matched the expected result; no bug found during execution. |

**Why this matters:** this confirms the core "save" flow actually persists the item to the correct list and that it's retrievable afterward — the most fundamental behavior the feature needs to get right before edge cases (duplicates, stock status, persistence) are worth testing.

**Note / Clarification Needed:** during execution, increasing a product's quantity within the saved list also increased the quantity of the same product in the cart. There is no documented specification defining whether this is the intended behavior. Two reasonable interpretations exist:
- The saved list is meant to directly mirror/drive cart quantities (i.e. it acts as a shortcut into the cart), in which case this behavior is correct.
- The saved list is meant to be an independent list that can later be transferred to the cart as a separate action, in which case quantity changes within the list should NOT silently affect the cart.

This should be clarified with the product owner/BA before deciding whether to log this as a bug or leave it as expected behavior.

---

### TC02 — Remove a product from a saved list

| Field | Value |
|---|---|
| Preconditions | User is logged in; user has an existing saved list |
| Test Steps | 1. On the homepage, click on a random product to open its product modal.<br>2. Click "Add to Saved List".<br>3. Select the previously created saved list.<br>4. Click "Save to List".<br>5. Click the back arrow to return to the homepage.<br>6. Select a different product on the homepage and open its product modal.<br>7. Click "Add to Saved List".<br>8. Select the same saved list.<br>9. Click "Save to List".<br>10. Click the back arrow to return to the homepage.<br>11. Click the user profile icon.<br>12. Select "Your saved lists".<br>13. Attempt to remove one of the two saved products from the list. |
| Test Data | Two different products selected from the homepage; an existing saved list |
| Expected Result | The user should be able to remove a product from the saved list directly, without it affecting the cart. |
| Priority | High |
| Type | Negative |
| Status | **Fail** — see BUG-001 |

**Why this matters:** the ability to remove an item is a basic counterpart to adding one — a list feature that only supports adding, never removing, is incomplete from a usability standpoint and forces users into unintended workarounds (or leaves unwanted items stuck on the list permanently).

---

### TC03 — Saved list persistence after logout/login and in a new (incognito) session

| Field | Value |
|---|---|
| Preconditions | User is logged in; user has an existing saved list |
| Test Steps | 1. On the homepage, click on a random product to open its product modal.<br>2. Click "Add to Saved List".<br>3. Select the previously created saved list.<br>4. Click "Save to List".<br>5. Click the user profile icon.<br>6. Click "Log out".<br>7. Log back in with the same account.<br>8. Click the user profile icon.<br>9. Select "Your saved lists" and verify the product is still present.<br>10. Close the browser.<br>11. Open the site (https://www.aldi.us) in an incognito/private window.<br>12. Log in with the same account.<br>13. Click the user profile icon.<br>14. Select "Your saved lists" and verify the product is still present. |
| Test Data | A random product selected from the homepage; an existing saved list |
| Expected Result | The added product remains on the saved list both after logging out and back in, and when accessed from a brand-new (incognito) browser session — confirming the list is persisted server-side, tied to the account, rather than held in local/temporary browser state. |
| Priority | Medium |
| Type | Positive / state management |
| Status | **Pass** — actual result matched the expected result; no bug found during execution. |

**Why this matters:** state/persistence bugs (item silently lost on logout or in a fresh session) are high-impact but easy to miss if testing only checks the immediate UI response right after clicking "Add".

---

## Bug Report

Fields used:

- **Bug ID** — unique identifier
- **Title** — short, descriptive summary
- **Environment** — browser, OS, device, URL
- **Preconditions**
- **Steps to Reproduce**
- **Expected Result**
- **Actual Result**
- **Severity** — impact on the system (Critical / Major / Minor / Trivial)
- **Priority** — urgency of fixing (High / Medium / Low)
- **Attachments** — screenshot / video / console log

### BUG-001

| Field | Value |
|---|---|
| Bug ID | BUG-001 |
| Title | No way to remove a product from a saved list |
| Environment | Chrome 128, Windows 11, https://www.aldi.us |
| Preconditions | User is logged in; saved list contains at least one product |
| Steps to Reproduce | 1. Add a product to a saved list (via a product modal → "Add to Saved List" → select list → "Save to List").<br>2. Go to the user profile → "Your saved lists".<br>3. Attempt to remove the product from the list. |
| Expected Result | The user can remove a product from the saved list directly from the list view (or from the product modal opened via the list), without affecting the cart. |
| Actual Result | No remove/delete option exists on the saved list view — the only trash icon present is tied to the quantity stepper on the "+ Add" control, which adjusts/removes the item from the **cart**, not the saved list. Reopening the product's modal from the saved list also offers no remove option — only "Add to cart" and "Add to Saved List" are available. |
| Severity | Major |
| Priority | High |
| Attachments | screenshot_saved_list_no_delete_1.png, screenshot_saved_list_no_delete_2.png |

![Saved list view — no delete option present](./screenshots/screenshot_saved_list_no_delete_1.png)

![Product modal opened from saved list — no delete option present](./screenshots/screenshot_saved_list_no_delete_2.png)

---

## Improvement Ticket (Cosmetic / UX Inconsistency)

Not every issue found during testing is a functional bug — some are inconsistencies that don't break functionality but affect UX quality and should still be tracked. Jira's standard issue type for this is **Improvement** (some teams use **Enhancement** instead), as opposed to **Bug**, which is reserved for functional defects.

Fields used (same shape as a Jira issue):

- **Issue Key** — unique identifier
- **Issue Type** — Improvement
- **Summary** — short, descriptive title
- **Environment** — browser, OS, URL
- **Description** — what is inconsistent and why it matters
- **Steps to Reproduce**
- **Expected Behavior**
- **Actual Behavior**
- **Severity** — Cosmetic (visual-only, no functional impact)
- **Priority** — Low / Medium
- **Attachments**

### Sample Improvement Ticket #1

| Field | Value |
|---|---|
| Issue Key | IMP-001 |
| Issue Type | Improvement |
| Summary | "View All" link inconsistently shows item count across storefront sections |
| Environment | Chrome 128, Windows 11, https://www.aldi.us/store/aldi/storefront |
| Description | On the storefront homepage, some product carousels show the item count next to the "View All" link (e.g. "Price Drops" → *View all (200+)*), while other sections only show the link with no count (e.g. "Labor Day BBQ" → *View All*). This is likely due to standard category carousels and seasonal/event-based promo carousels being built as different components. While not a functional defect, it creates an inconsistent UX pattern across the same page. |
| Steps to Reproduce | 1. Go to the ALDI US storefront homepage.<br>2. Locate the "Price Drops" section header and note the "View all (200+)" link.<br>3. Scroll to the "Labor Day BBQ" section header and note the "View All" link. |
| Expected Behavior | All "View All" links on the storefront follow the same pattern — either all show the item count, or none do. |
| Actual Behavior | "Price Drops" shows the count ("View all (200+)"); "Labor Day BBQ" does not ("View All"). |
| Severity | Cosmetic |
| Priority | Low |
| Attachments | screenshot_view_all_inconsistency.png |

![View All link inconsistency](./screenshots/screenshot_view_all_inconsistency.png)

---

### Sample Improvement Ticket #2

| Field | Value |
|---|---|
| Issue Key | IMP-003 |
| Issue Type | Improvement |
| Summary | No direct way to remove a cart item when quantity is greater than 1 |
| Environment | Chrome 128, Windows 11 (mobile cart view), https://www.aldi.us |
| Description | In the cart drawer, an item with a quantity of 1 shows a trash/delete icon next to the stepper, allowing one-click removal. However, once quantity is 2 or more, the trash icon is replaced by a "−" (decrement) control, and there is no direct way to remove the item — the user must repeatedly tap "−" to bring the quantity down to 1 before the delete option appears. This adds unnecessary friction to a common action (removing an item the user changed their mind about), especially for items with a higher quantity. |
| Steps to Reproduce | 1. Add 2 or more units of any product to the cart.<br>2. Open the cart drawer.<br>3. Attempt to remove the item directly. |
| Expected Behavior | The user should be able to remove a cart item in one action regardless of its quantity (e.g. a persistent trash icon, or a "remove item" option alongside the quantity stepper). |
| Actual Behavior | The trash icon only appears once quantity is decremented down to 1; at quantity 2+, only "−"/"+" controls are shown. |
| Severity | Cosmetic / UX friction (no functional blocker, but adds avoidable steps) |
| Priority | Medium |
| Attachments | screenshot_cart_quantity_delete.png |

![Cart item delete requires reducing quantity first](./screenshots/screenshot_cart_quantity_delete.png)
