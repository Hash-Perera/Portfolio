## Agent Modification Rules

Agents are strictly limited to modifying the application's **source code only** for the purpose of implementing or improving the requested **UI, UX, and application functionality**.

Agents may:

* Create, update, or refactor source-code files required for the requested feature.
* Modify frontend UI, layouts, components, styles, animations, responsiveness, and user interactions.
* Implement or update application functionality directly related to the assigned task.
* Refactor existing source code when necessary to support the requested implementation.

Agents must NOT:

* Run `git commit`, `git push`, `git pull`, `git merge`, `git rebase`, `git checkout`, or any other Git operation.
* Create, delete, rename, or switch Git branches.
* Modify Git history or repository configuration.
* Create commits on behalf of the user.
* Perform deployments or publishing operations.
* Change CI/CD pipelines unless the task explicitly requests source-code changes to those files.
* Modify environment, server, operating-system, or machine-level configuration.
* Perform unrelated cleanup or changes outside the scope of the requested feature.
* Execute destructive commands or remove files unless deletion is clearly required by the requested source-code change.

### Core Rule

**Only modify the source code necessary to design and implement the requested UI and functionality.**

Do not perform repository management, Git operations, deployment activities, or any other operational tasks.

After completing the requested changes, leave all modified files **uncommitted** so the user can review and handle Git operations manually.
