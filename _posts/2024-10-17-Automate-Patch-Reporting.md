---
title: Automated Patch Reporting with Patcher
date: 2024-10-17
author: spesh
---

![Patcher Banner](assets/posts/automate-patch-reporting/PatcherBanner.png)

> **Note** <br> A condensed version of this article was published on Jamf's [Tech Thoughts](https://community.jamf.com/t5/tech-thoughts/automate-patch-reporting/ba-p/331814) blog in November of 2024. The version below has since been updated with recent changes made to Patcher. 
{: .prompt-info}

Recently, the Compliance and Security Operations departments at my organization asked if they could get some visibility into how macOS Applications are patched on a regular basis. Specifically, they were hoping I would be able to provide them with an Excel spreadsheet containing the applications we deploy via Jamf and how many of those applications were on the latest version. 

After the creating the first two reports manually, I was quickly reminded of the DRY (Don’t Repeat Yourself) principle and knew there had to be a better way of accomplishing the task. Being a bit more versed in Python than shell scripting, I quickly threw together a script that did the job. I had no intention of making the code open source for the sole reason I did not think anyone would benefit from such an automation. It was not until my friend Chris Ball recommended I do so that the thought crossed my mind. This is where [Patcher](https://github.com/liquidz00/Patcher) comes in. 

Manually entering patch management data into varying formats to send to different departments can be of vital importance to an organization, but takes away from focusing on critical tasks. As MacAdmins, our time is much better spent on the important stuff—policy setup, CVE identification, remediation strategies, ensuring the latest flavor of macOS is approved for install… the list goes on and on. As embarrassing as it is to say, I did not realize how much effort and time I was saving by automating this process and figured if I could help just one MacAdmin save some time it would be worth it.

## What does Patcher do?

Patcher leverages the Jamf Pro API to automate the generation of comprehensive patch management reports, transforming data into actionable insights. Patcher was intentionally designed as Command Line Interface (CLI) so it could be integrated easily with LaunchAgents running on a schedule. With a one-line command, Patcher can export patch reports in Excel, PDF, and HTML formats from your Jamf Pro instance. Assuming your organization is named *AnyOrg*, a PDF report could look like the following:

![Example PDF](https://patcher.liquidzoo.io/_images/example_pdf.png)
_Example PDF for AnyOrg_

When developing Patcher as an open-sourced MacAdmin tool, we (Chris and myself) sought a solution that would not only save time but also enhance the accuracy and presentation of the data. It does not matter if you're a seasoned admin or a newcomer seeking efficiency in your workflow, we wanted to make Patcher as simplified and user-friendly as possible. This includes helping end-users setting up the tool for continued success.

## Setting it up

Before installing Patcher, a couple of prerequisites need to be met. First, Python (version 3.10 or higher) needs to be installed on the machine. Python installation is fairly straightforward (download the `.pkg` file from [python.org](https://python.org) and follow installation prompts). However, [detailed instructions for installation](https://docs.python.org/3/using/mac.html) can be found in Python’s documentation if necessary. Git also needs to be installed and can be installed with Xcode or Xcode Command Line Tools. Lastly, you will need access to your organization’s instance of Jamf Pro. Patcher can then be installed via Python’s `pip`: `python3 -m pip install patcherctl`.

We realize that not all MacAdmins are comfortable using the command line. Additionally, we realized our end-users may not have ever used an API before and are not familiar with how authentication works. With these in mind, we wanted to implement a “setup assistant” of sorts that guides users through the initial setup process. This process is automatically triggered the first time Patcher is used. Detailed documentation on the [setup assistant](https://patcher.liquidzoo.io/user/setup_assistant.html) can be found in Patcher’s documentation. 

Something to be aware of before running the setup assistant is whether or not Single Sign On (SSO) is enabled. As the Jamf Pro API does not [support SSO](https://developer.jamf.com/jamf-pro/docs/jamf-pro-api-overview#authentication-and-authorization), an API role and API client will need to be manually created to be able to pass to Patcher. For specific instructions on creating API Roles and Clients for Patcher, reference documentation can be found on [Patcher’s website](https://patcher.liquidzoo.io/user/jamf_deployment.html#creating-an-api-role-client) or in [Jamf Pro’s documentation](https://learn.jamf.com/en-US/bundle/jamf-pro-documentation-current/page/API_Roles_and_Clients.html). If referencing Jamf Pro’s documentation, make sure the following privileges are granted to the role: 

- Read Patch Management Software Titles
- Read Patch Policies
- Read Mobile Devices
- Read Mobile Device Inventory Collection

- Read Mobile Device Applications
- Read API Integrations
- Read API Roles
- Read Patch Management Settings
- Update API Integrations

With the prerequisites out of the way, the setup assistant will launch and inquire if you want to use the automatic setup or the manual setup. Select **manual setup** if using SSO, otherwise the automatic setup should do the trick. You will be asked to set the Header and Footer values for PDF reports, an option to provide a company logo image and the option to pass a custom font instead of the default font of Google’s Assistant. All of which can be modified later if needed. 

## Examples and Usage

> **Important** <br> The project is called Patcher, but the executable is `patcherctl`. Why? The name *patcher* was already taken on the Python package index. 
{: .prompt-warning}

To see all commands and their corresponding options, visit the [Usage page](https://patcher.liquidzoo.io/user/usage.html) of Patcher’s documentation. Alternatively, execute the command `patcherctl --help`. For the sake of this article, we are going to focus on generating reports using the `export` command without any additional options. All that needs to be provided is the path where you would like the reports to be saved. For example, if I wanted to save the reports to my Desktop folder, I would run the following command: 

```bash
patcherctl export --path '~/Desktop'
```

Assuming no errors were encountered during the process, I would find a directory on my Desktop called **Patch Reports** with patch reports in Excel, PDF, and HTML formats inside. 

![Patch Reports directory created by Patcher](assets/posts/automate-patch-reporting/patchreports.png)
_Patch Reports directory created by Patcher_

## Conclusion

Thank you so much for taking the time to read this and checking out the project. It is not lost on us how quickly chaotic our jobs can become, Chris and I sincerely appreciate the fact you took time to read this article to this point. We strongly believe that diverse ideas strengthen products. If you have any feedback on the tool, we encourage you to get in touch! This could be through pull requests, issue reporting, or feature suggestions on the repository or finding us on the MacAdmins slack channel `#patcher`. Your input is invaluable in shaping the future of this tool.