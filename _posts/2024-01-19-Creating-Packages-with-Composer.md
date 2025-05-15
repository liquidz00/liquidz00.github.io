---
title: Creating Packages with Composer
date: 2024-01-19
author: spesh
---
<!-- markdownlint-capture -->
<!-- markdownlint-disable -->

# Using Jamf's Composer to Create Installer Packages

This article outlines manually creating `.pkg` files using the Composer application from Jamf.

![ComposerIcon](assets/posts/creating-packages-with-composer/composer-icon.png){: width="256" height="256" }
_Composer Application Icon_

## Helpful Resources

[Composer User Guide](https://learn.jamf.com/bundle/composer-user-guide-current/page/Composer_Overview.html)

### Application Interface Overview

![UserInterface-1](assets/posts/creating-packages-with-composer/composer-user-interface.png)
_Figure 1.1 - Composer User Interface_

![UserInterface-2](assets/posts/creating-packages-with-composer/composer-user-interface-2.png)
_Figure 1.2 - Composer User Interface with Application_

1. **Sources Pane** - the package source. Location to drag and drop target application to begin packaging process.
2. **Packages Pane** - list of all previously made packages. Composer keeps a history if the need to re-package an application arises.
3. **Build** - button that will convert target application into a `.pkg` file.
4. **Contents** - a collapsable view of what is being packaged. For more complicated builds, LaunchDaemons and LaunchAgents can be added, or other files to include with package. (*Figure 1.2*)
5. **Permissions** - current file permissions for application that is being packaged. Ellipsis button will allow modifying file permissions of all enclosed items. (*Figure 1.2*)

## Packaging Process

1. Begin by installing the target application. For demonstration purposes, Microsoft Edge will be used. 
2. Once application has completed installation, drag application from `/Applications` directory to **Sources Pane** in Composer. 
3. Target application will show in **Contents** section of Composer. 
4. With the target application selected, ensure *Owner* is set to `root` and *Group* is set to `wheel` in the **Permissions** section. 
5. Click the ellipsis button and select *Apply Owner and Group to target application and All Enclosed Items*.
    
    ![ApplyOwner](assets/posts/creating-packages-with-composer/composer-apply-owner.png)
    _Applying owner and group to target and all enclosed items_
    
6. (Optional) Rename the package by right-clicking the name under the **Sources** Pane. 
7. Click the **Build as PKG** button in upper right hand corner of Composer. *(See Figure 1.1, item 3)*
8. A dialog box will appear asking where the `.pkg` file should be saved. Select preferred destination and click *Save*. 

## Deploying Package via Jamf Pro

1. Upload the `.pkg` file created in previous step to Jamf Pro. 
    1. Log into your instance of Jamf Pro.
    2. Select *Settings* in the sidebar on left side.
        
        ![Jamf Pro Settings](assets/posts/creating-packages-with-composer/jamf-pro-settings.png)
        
    3. Navigate to the *Computer Management* tab and select *Packages*.
        
        ![Jamf Pro Packages](assets/posts/creating-packages-with-composer/jamf-pro-packages.png)
        
    4. Click *New* in upper right hand corner.
    5. Click *Choose File* option under *Filename* section, upload package from chosen directory location.
        
        ![Jamf Pro Upload](assets/posts/creating-packages-with-composer/jamf-pro-filename-upload.png)
        
    6. (Optional) Fill out remaining fields of form including Category, Info & Notes sections
2. Create a policy in Jamf Pro that installs the package. 
    1. Click *Computers* in the sidebar on left side, select *Policies*.
        
        ![Jamf Pro Policies](assets/posts/creating-packages-with-composer/jamf-pro-policies-tab.png)
        
    2. Click *New* in upper right hand corner to create a new policy.
    3. Give the policy a name, in this example we will use `Microsoft Edge`.
    4. Select the Category dropdown menu to assign the policy to a category.
    5. Choose a policy trigger if you want this application to automatically get installed to computers in scope.
    6. Ensure *Execution Frequency* is set properly. If application is being added to Self Service, execution frequency should be set to *Ongoing*.
    7. Click the *Packages* payload section and click *Configure*.
    8. Find the package that was uploaded in Step 1 from the list of available packages and select *Add*.
    9. Configure Scope accordingly (for demonstration, *All Computers* and *All Users* was chosen).
    10. (Optional) If application is being added to Self Service, select *Self Service* tab and fill out fields accordingly. Do not forget to configure the *Categories* section at the bottom so application shows under proper category in Self Service.
        
        ![Jamf Pro Categories](assets/posts/creating-packages-with-composer/jamf-pro-categories.png)
        
    11. Click *Save*.
    12. (Optional) Open Self Service application, ensure application shows as expected. 