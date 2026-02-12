Open 2 terminals, one for frontend, one for backend

# Front end

# Only do this once

cd frontend
npm install

# backend

cd backend
py -m uvicorn main:app --reload

How to make changes:

# Step 1: Switch to your branch

git checkout abdullah

# Step 2: Confirm you're on your branch

git branch

# Expect: \* abdullah

# Step 3: Code, then commit your changes

git add .
git commit -m "Implement feature X"

# Step 4: Bring latest main INTO your branch

git fetch origin
git merge origin/main

# If conflicts appear:

# - resolve them

# - then:

# git add .

# git commit -m "Resolve merge conflicts"

# Step 5: Merge your branch into main

git checkout main
git pull origin main
git merge abdullah

# Step 6: Push updated main

git push origin main
