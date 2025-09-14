# VitalsCloud2 GitHub Repository Setup Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  VitalsCloud2 GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Current repository status:" -ForegroundColor Green
git status --porcelain
if ($LASTEXITCODE -eq 0) {
    Write-Host "Git repository is clean and ready" -ForegroundColor Green
} else {
    Write-Host "Git repository has issues" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Repository contains:" -ForegroundColor Yellow
$fileCount = (git ls-files | Measure-Object).Count
Write-Host "Files committed: $fileCount" -ForegroundColor White

Write-Host ""
Write-Host "GitHub repository creation page should be open in your browser." -ForegroundColor Cyan
Write-Host ""
Write-Host "Please complete these steps in GitHub:" -ForegroundColor Yellow
Write-Host "1. Repository name: VitalsCloud2" -ForegroundColor White
Write-Host "2. Description: Healthcare Clinic Management System - MERN Stack" -ForegroundColor White
Write-Host "3. Choose Public or Private" -ForegroundColor White
Write-Host "4. DO NOT initialize with README, .gitignore, or license" -ForegroundColor Red
Write-Host "5. Click Create repository" -ForegroundColor White
Write-Host ""

do {
    $response = Read-Host "Have you created the GitHub repository? (y/n)"
} while ($response -notmatch "^[yn]$")

if ($response -eq "n") {
    Write-Host "Please create the repository first, then run this script again." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Great! Now we need your repository URL..." -ForegroundColor Green
Write-Host ""

$githubUsername = Read-Host "Enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "GitHub username is required!" -ForegroundColor Red
    exit 1
}

$repoUrl = "https://github.com/$githubUsername/VitalsCloud2.git"

Write-Host ""
Write-Host "Using repository URL: $repoUrl" -ForegroundColor Cyan
Write-Host ""

$confirm = Read-Host "Is this correct? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Please run the script again with the correct username." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Setting up remote origin..." -ForegroundColor Green

try {
    git remote add origin $repoUrl 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Remote origin might already exist, removing and re-adding..." -ForegroundColor Yellow
        git remote remove origin 2>$null
        git remote add origin $repoUrl
    }

    Write-Host "Renaming branch to main..." -ForegroundColor Green
    git branch -M main
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Green
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! Your VitalsCloud2 repository has been created!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Repository URL: https://github.com/$githubUsername/VitalsCloud2" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Your healthcare management system is now available on GitHub!" -ForegroundColor White
        Write-Host ""
        
        $openRepo = Read-Host "Would you like to open your repository in the browser? (y/n)"
        if ($openRepo -eq "y") {
            Start-Process "https://github.com/$githubUsername/VitalsCloud2"
        }
        
    } else {
        Write-Host "Failed to push to GitHub. Please check your credentials." -ForegroundColor Red
    }
    
} catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Script completed!" -ForegroundColor Cyan
