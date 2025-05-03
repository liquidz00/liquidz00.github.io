---
title: My Patch Management Process
date: 2024-01-31
author: spesh
---

# Patch Management Process

> **Note** <br>This was originally written as an SOP article for internal use at my organization. However, the base principles can be applied in any environment using Jamf Pro as an MDM. 
{: .prompt-info }

## Configure Software Title

Configuring software titles in Jamf is not *required* in order to Patch applications properly. However, it is recommended as it greatly simplifies the smart group creation process by using built-in criteria that would otherwise be unavailable.

1. Log into Jamf Pro with your administrator account. 
2. In the sidebar on the left, click the **Computers** tab. 
3. Click the **Patch Management** tab in the sidebar. A list of software titles that have already been configured will appear. Ensure the software title has not already been configured by searching for it on the list. 
4. If the software title has not been configured, click **New** in the upper right hand corner. 
5. Click the chevron (`>`) next to Jamf to load available software titles through Jamf. Once the list has loaded, search for the software title by using the Search field near the top of the list. 
6. If the software title is available, click the plus (`+`) to begin configuration.
    <a id="composer-article-ref"></a>
    - In circumstances which the software title is not available, patching will have to be done manually. If using Composer, the article [creating packages with composer](/posts/Creating-Packages-with-Composer) outlines this process.
7. Click **Edit** in the bottom right corner, use the **Software Title Settings** tab to configure basic settings for the software title. 
8. (Optional) Assign the software title to a category by selecting the **Category** drop down menu. 
9. If the software title uses an extension attribute, click the **Extension Attributes** tab and accept the terms. 
10. Click **Save** to finalize configuration.  

## Create Smart Groups

> The naming scheme of your Smart Groups does not matter, but it is a good idea to remain consistent. <br>As an example, we prefix our Smart Groups with `Has -` for hosts that have a certain application installed, and `Latest Version -` for hosts on the latest version of the application. Choose what makes the most sense for you.
{: .prompt-tip }

1. If not already logged into Jamf Pro, login and navigate to the **Computers** tab. 
2. Click the **Smart Computer Groups** tab in the sidebar. 
3. Two smart group will need to be created for patching purposes: 
    - One will define who has the software title installed on their machine
    - The second will define who has the latest version of the software title installed already
4. Click **New** in the upper right hand corner to create the first Smart Group. 
5. Assign the Smart Group a name using the Smart Group naming standard you've chosen, followed by the application name.
    - For example, if setting up patching for Microsoft Edge, the Smart Group name would be `Has - Microsoft Edge`
6. Click the **Criteria** tab, and then click **Add** on the far right hand side of the screen. 
7. Using the Jamf Pro Documentation on [Smart Groups](https://learn.jamf.com/bundle/jamf-pro-documentation-10.38.0/page/Smart_Groups.html) as a guide, use the following criteria **exactly** as seen below. 
    
    
    | **Criteria**      | Operator | Value                          |
    | ----------------- | -------- | ------------------------------ |
    | Application Title | `has`    | `Software Title Goes Here.app` |
    
    ![Has-Smart-Group](assets/posts/patch-management-process/has-smart-group.png)
    _"Has" Smart Group criteria_
    
8. Click **Save** in the bottom right hand corner to save the first Smart Group. 
    > **Important** <br> After saving, it is important to verify the criteria is working as expected. Click the **View** button in the bottom right hand corner to see a list of computers matching the criteria. If no computers are found, it could indicate an issue with the smart group criteria. 
    {: .prompt-warning }
9.  Click the **Smart Computer Groups** tab in the sidebar again, and click **New** to create the second Smart Group. 
10. Using the naming scheme you have chosen, name your latest version Smart Group. 
    - Using Microsoft Edge as an example again, the Smart Group name would be `Latest Version - Microsoft Edge`
11. Click the **Criteria** tab, and then click **Add** on the far right hand side of the screen. 
12. Patch reporting criteria will not be on the first list of Smart Group criteria options. Click the **Show Advanced Criteria** button in the upper right hand corner to find the Patch Reporting options. 
    
    ![Advanced Criteria](assets/posts/patch-management-process/show-advanced-criteria.png)
    
13. Use the following criteria to configure the logic for this Smart Group accordingly. 
    
    
    | **Criteria**                   | Operator | Value            |
    | ------------------------------ | -------- | ---------------- |
    | Patch Reporting Software Title | `is`     | `Latest Version` |
    
    ![Latest Version Smart Group](assets/posts/patch-management-process/latest-version-smart-group.png)
    _"Latest Version" Smart Group_
    
14. Click **Save** in the bottom right hand corner to save the second Smart Group. Verify the logic is working as expected by clicking the **View** button. 
15. There should now be two separate Smart Groups (where *Software Title* is the application you are patching):
    1. `Has - Software Title`
    2. `Latest Version - Software Title`

## Installomator vs Composer

> We rely on Installomator by default to automate our patch management process. If Installomator is not approved for use in your organization, alternate methods can be leveraged, such as [Composer](https://learn.jamf.com/en-US/bundle/composer-user-guide-current/page/Package_Source_Creation.html), [Jamf App Installers](https://learn.jamf.com/en-US/bundle/jamf-pro-documentation-current/page/App_Installers.html) or [AutoPKG](https://github.com/autopkg/autopkg).
{: .prompt-info }

1. Navigate to the **Labels.txt** file on the [Installomator GitHub repository](https://learn.jamf.com/bundle/jamf-pro-documentation-10.38.0/page/Smart_Groups.html).
2. Press `CMD + F` (⌘F) on your keyboard to find the software title in question in the list. 
    - Installomator’s labels are all lowercase and all one-word. Keep this in mind when searching for your software title. 
3. If the label exists, Installomator can be used for patching. If the label does not exist, the software title will need to be patched manually using [Composer](#composer-article-ref). 

## Create Policy

> The *Category*, *Trigger*, and *Execution Frequency* referenced in step 4 are how we configure our patch policies but can be changed to meet the requirements of your environment.
{: .prompt-tip }

1. Back in Jamf Pro, click **Policies** under the **Computers** section. 
2. Click **New** in the upper right hand corner to create a new policy. 
3. The naming convention for patch management policies is `Patch Management - Software Title` where *Software Title* is the application we are patching.
4. In the **General** payload configure the following properties:
    1. **Category** - Patch Management
    2. **Trigger** - Recurring Check-in
    3. **Execution Frequency** - Once every day
5. If using Installomator, follow steps 6-8. If using Composer, follow steps 9 & 10. 
6. Click the **Scripts** payload in the sidebar on the left, and then select **Configure**. 
7. Find the `Insallomator.sh` script on the list that appears, and click **Add**.
8. Configure the following properties: 
    - **Parameter 4** - Installomator label for software title (i.e., `firefox`)
    - For Parameters 4 & 5, reference [Installomator docs](https://github.com/Installomator/Installomator/wiki/Configuration-and-Variables) to choose the configuration that works best for you.
9. Click the **Packages** payload in the sidebar on the left, and then select **Configure**. 
10. Find the package that you uploaded to Jamf Pro on the list that appears and click **Add**. 
11. Navigate to the **Maintenance** payload in the sidebar on the left, and click **Configure**. 
12. By default the **Update Inventory** option should be selected. If it is not, click the checkbox next to it to enable it. 
    
    ![Update Inventory](assets/posts/patch-management-process/update-inventory.png)
    
    > **Important** <br> Updating Inventory for patching purposes is necessary so Jamf can automatically put computers in the proper Smart Groups created previously. 
    {: .prompt-warning }

13. Click the **Scope** tab near the top of the screen and configure the following properties: 
    - **Targets** - `Has - Software Title` Smart Group created previously
    - **Exclusions** - `Latest Version - Software Title` Smart Group created previously
14. Click **Save** in the bottom right hand corner of the screen.
15. (Optional, but recommended) Add the Patch Policy to your Jamf Pro Dashboard for monitoring. Click the checkbox next to **Show in Jamf Pro Dashboard** in the upper right hand corner of the screen.
    
    ![Add to Jamf Pro Dashboard](assets/posts/patch-management-process/show-in-dashboard.png)
    _Jamf Pro Dashboard checkbox_

# Done! 🎉

You now have a policy set up to update a software title automatically. If you used Composer to manually create a package, **it is important to remember** you only created an update for that specific version of the application in question. As soon as a new version is released, you will need to create another package for that application. If Installomator was leveraged, reference [Installomator's exit codes](https://github.com/Installomator/Installomator/wiki/Installomator-Exit-Codes) if your policies are failing.