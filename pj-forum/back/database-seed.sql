-- ============================================
-- FORUM DATABASE SEED DATA
-- Complete setup for school forum
-- ============================================

USE forum_db;

-- ============================================
-- 1. CLEAR EXISTING DATA (Optional - use carefully!)
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE thread_tags;
TRUNCATE TABLE thread_subscriptions;
TRUNCATE TABLE notifications;
TRUNCATE TABLE replies;
TRUNCATE TABLE threads;
TRUNCATE TABLE tags;
TRUNCATE TABLE categories;
-- Don't truncate users - keep your test account
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 2. CREATE SAMPLE USERS
-- Password for all: "password123" (already bcrypt hashed)
-- ============================================

-- Admin account
INSERT INTO users (username, email, password, role, status, bio, avatar, created_at, updated_at, last_login_at) VALUES
('admin', 'admin@school.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'ACTIVE', 'System Administrator', '👨‍💼', NOW(), NOW(), NOW());

-- Moderators
INSERT INTO users (username, email, password, role, status, bio, avatar, created_at, updated_at, last_login_at) VALUES
('mod_john', 'john.mod@school.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'MODERATOR', 'ACTIVE', 'Math & Science Moderator', '👨‍🏫', NOW(), NOW(), NOW()),
('mod_sarah', 'sarah.mod@school.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'MODERATOR', 'ACTIVE', 'Tech Support Moderator', '👩‍💻', NOW(), NOW(), NOW());

-- Regular users
INSERT INTO users (username, email, password, role, status, bio, avatar, created_at, updated_at, last_login_at) VALUES
('alice_nguyen', 'alice@student.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ACTIVE', 'Computer Science student, loves coding!', '👩‍💻', NOW(), NOW(), NOW()),
('bob_tran', 'bob@student.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ACTIVE', 'Math enthusiast and problem solver', '🧮', NOW(), NOW(), NOW()),
('carol_le', 'carol@student.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ACTIVE', 'Physics major, always curious!', '🔬', NOW(), NOW(), NOW()),
('david_pham', 'david@student.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ACTIVE', 'Love playing guitar and coding', '🎸', NOW(), NOW(), NOW()),
('emma_hoang', 'emma@student.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ACTIVE', 'Aspiring data scientist', '📊', NOW(), NOW(), NOW()),
('frank_do', 'frank@student.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ACTIVE', 'Web developer and coffee addict ☕', '💻', NOW(), NOW(), NOW());

-- ============================================
-- 3. CREATE CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, icon, display_order, created_at, updated_at) VALUES
('General Discussion', 'general', 'General topics and casual conversations', '💬', 1, NOW(), NOW()),
('Homework Help', 'homework', 'Get help with assignments and homework questions', '📚', 2, NOW(), NOW()),
('Programming & Tech', 'programming', 'Coding, software, and technology discussions', '💻', 3, NOW(), NOW()),
('Math & Science', 'math-science', 'Mathematics, physics, chemistry, and biology', '🔬', 4, NOW(), NOW()),
('School Events', 'events', 'School activities, clubs, and upcoming events', '🎉', 5, NOW(), NOW()),
('Study Groups', 'study-groups', 'Find and organize study groups', '👥', 6, NOW(), NOW()),
('Off-Topic', 'off-topic', 'Anything else that doesn\'t fit other categories', '🎲', 7, NOW(), NOW());

-- ============================================
-- 4. CREATE TAGS
-- ============================================
INSERT INTO tags (name, slug, created_at, updated_at) VALUES
-- Programming
('java', 'java', NOW(), NOW()),
('python', 'python', NOW(), NOW()),
('javascript', 'javascript', NOW(), NOW()),
('react', 'react', NOW(), NOW()),
('spring-boot', 'spring-boot', NOW(), NOW()),
('sql', 'sql', NOW(), NOW()),
('web-dev', 'web-dev', NOW(), NOW()),

-- Subjects
('math', 'math', NOW(), NOW()),
('calculus', 'calculus', NOW(), NOW()),
('physics', 'physics', NOW(), NOW()),
('chemistry', 'chemistry', NOW(), NOW()),
('biology', 'biology', NOW(), NOW()),

-- General
('urgent', 'urgent', NOW(), NOW()),
('homework', 'homework', NOW(), NOW()),
('exam-prep', 'exam-prep', NOW(), NOW()),
('tutorial', 'tutorial', NOW(), NOW()),
('question', 'question', NOW(), NOW()),
('discussion', 'discussion', NOW(), NOW());

-- ============================================
-- 5. CREATE SAMPLE THREADS
-- ============================================

-- Thread 1: Programming question
INSERT INTO threads (title, content, author_id, category_id, is_anonymous, is_pinned, is_locked, views, created_at, updated_at, last_reply_at) VALUES
('How to implement JWT authentication in Spring Boot?', 
'Hi everyone! I\'m working on a school project and need to implement JWT authentication in Spring Boot. I\'ve set up the basic structure but I\'m getting errors when trying to validate tokens. Has anyone done this before? Any good tutorials or code examples would be really helpful!

Current error: `java.lang.IllegalArgumentException: JWT String argument cannot be null or empty.`

My JwtUtil class seems fine but something is wrong with the filter. Thanks in advance!', 
4, 3, 0, 1, 156, NOW(), NOW(), NOW());

-- Thread 2: Math help
INSERT INTO threads (title, content, author_id, category_id, is_anonymous, is_pinned, is_locked, views, created_at, updated_at, last_reply_at) VALUES
('Need help with calculus integration problem', 
'Can someone explain how to solve this integration problem?

∫(x² + 3x - 2)/(x + 1) dx

I tried using substitution but I\'m stuck. The answer should involve ln|x+1| but I can\'t figure out the steps. 

Thanks!', 
5, 4, 0, 0, 0, 89, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR);

-- Thread 3: Pinned announcement
INSERT INTO threads (title, content, author_id, category_id, is_anonymous, is_pinned, is_locked, views, created_at, updated_at, last_reply_at) VALUES
('📌 Welcome to the School Forum! Read This First', 
'Welcome to our school forum! 🎉

**Forum Rules:**
1. Be respectful to everyone
2. No spam or advertising
3. Use appropriate categories for your posts
4. Search before asking - your question might already be answered
5. Help others when you can!

**Categories:**
- 💬 General Discussion - Casual chat
- 📚 Homework Help - Academic questions
- 💻 Programming & Tech - Coding help
- 🔬 Math & Science - STEM subjects
- 🎉 School Events - Activities and clubs

If you need help, contact @mod_john or @mod_sarah.

Happy posting! 😊', 
1, 1, 0, 1, 0, 234, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 6 DAY);

-- Thread 4: Study group
INSERT INTO threads (title, content, author_id, category_id, is_anonymous, is_pinned, is_locked, views, created_at, updated_at, last_reply_at) VALUES
('Looking for study partners for Physics midterm', 
'Hey everyone! The physics midterm is coming up next week and I\'m looking for study partners. 

**Topics to cover:**
- Newton\'s Laws of Motion
- Energy and Work
- Momentum and Collisions
- Rotational Motion

Planning to meet at the library this Saturday 2-5 PM. Reply if interested!', 
6, 6, 0, 0, 0, 45, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 2 HOUR);

-- Thread 5: Event announcement
INSERT INTO threads (title, content, author_id, category_id, is_anonymous, is_pinned, is_locked, views, created_at, updated_at, last_reply_at) VALUES
('Coding Competition Next Month - Sign Up Now! 🏆', 
'The annual school coding competition is happening next month!

**Details:**
- Date: January 15, 2025
- Time: 9 AM - 5 PM
- Location: Computer Lab Building
- Prize: $500 for 1st place, $300 for 2nd, $200 for 3rd

**Competition Format:**
- Individual participation
- 5 algorithm problems (2 hours)
- Languages allowed: Java, Python, C++, JavaScript

To sign up, email cs.club@school.edu by December 31st.

Good luck! 💪', 
8, 5, 0, 0, 0, 178, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 20 HOUR);

-- Thread 6: React question
INSERT INTO threads (title, content, author_id, category_id, is_anonymous, is_pinned, is_locked, views, created_at, updated_at, last_reply_at) VALUES
('React useState not updating immediately?', 
'I have a weird issue with React useState. When I call setCount(count + 1), it doesn\'t update immediately. I have to click the button twice to see the change.

```javascript
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count); // Still shows old value!
};
```

Is this normal behavior? How do I fix it?', 
7, 3, 0, 0, 0, 67, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 4 HOUR);

-- Thread 7: Anonymous homework question
INSERT INTO threads (title, content, author_id, category_id, is_anonymous, is_pinned, is_locked, views, created_at, updated_at, last_reply_at) VALUES
('How to approach this chemistry problem?', 
'I\'m stuck on this chemistry homework problem and the deadline is tomorrow. Don\'t want to put my name because I feel stupid asking this... 😅

Question: Calculate the pH of a 0.1M solution of acetic acid (Ka = 1.8 × 10⁻⁵)

I know the formula pH = -log[H+] but how do I find [H+] from Ka? Thanks!', 
8, 2, 1, 0, 0, 34, NOW() - INTERVAL 6 HOUR, NOW() - INTERVAL 6 HOUR, NOW() - INTERVAL 5 HOUR);

-- Thread 8: Discussion
INSERT INTO threads (title, content, author_id, category_id, is_anonymous, is_pinned, is_locked, views, created_at, updated_at, last_reply_at) VALUES
('Best laptop for CS students in 2025?', 
'I need to buy a new laptop for programming and I\'m not sure what to get. My budget is around $1000-1500.

Requirements:
- Good for coding (VS Code, IntelliJ, etc.)
- Can run VMs and Docker
- Good battery life for all-day classes
- Not too heavy to carry around

Currently looking at:
1. MacBook Air M3
2. Dell XPS 15
3. ThinkPad X1 Carbon

What do you guys use and recommend?', 
9, 7, 0, 0, 0, 102, NOW() - INTERVAL 8 HOUR, NOW() - INTERVAL 8 HOUR, NOW() - INTERVAL 7 HOUR);

-- ============================================
-- 6. CREATE SAMPLE REPLIES
-- ============================================

-- Replies for Thread 1 (JWT authentication)
INSERT INTO replies (content, thread_id, author_id, is_anonymous, created_at, updated_at) VALUES
('I had the same issue! The problem is that you need to extract the token from the "Bearer " prefix. Here\'s how I fixed it:

```java
String header = request.getHeader("Authorization");
if (header != null && header.startsWith("Bearer ")) {
    String token = header.substring(7);
    // Now validate token
}
```

Make sure you\'re sending the token with "Bearer " prefix in your frontend!', 
1, 8, 0, NOW(), NOW()),

('Also check your SecurityConfig! You might be blocking the requests before they reach your filter. Make sure you have:

```java
.requestMatchers("/api/auth/**").permitAll()
```

This allows authentication endpoints to bypass security.', 
1, 2, 0, NOW(), NOW()),

('Thanks @frank_do and @mod_sarah! That fixed it. The issue was I forgot to add "Bearer " in my frontend axios config. Working now! 🎉', 
1, 4, 0, NOW(), NOW());

-- Replies for Thread 2 (Calculus)
INSERT INTO replies (content, thread_id, author_id, is_anonymous, created_at, updated_at) VALUES
('You need to use polynomial long division first! 

Divide (x² + 3x - 2) by (x + 1):
Result: x + 2 - 4/(x+1)

So the integral becomes:
∫(x + 2)dx - ∫4/(x+1)dx
= x²/2 + 2x - 4ln|x+1| + C

Hope this helps!', 
2, 2, 0, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR),

('@mod_john explained it perfectly! The key is recognizing when you need polynomial division vs substitution. If the degree of numerator ≥ degree of denominator, always try division first.', 
2, 5, 0, NOW() - INTERVAL 30 MINUTE, NOW() - INTERVAL 30 MINUTE),

('Thank you so much! I completely forgot about polynomial division. Makes sense now! 🙏', 
2, 5, 0, NOW() - INTERVAL 20 MINUTE, NOW() - INTERVAL 20 MINUTE);

-- Replies for Thread 3 (Welcome - pinned)
INSERT INTO replies (content, thread_id, author_id, is_anonymous, created_at, updated_at) VALUES
('Thanks for setting this up! Already finding it super helpful for homework questions. 📚', 
3, 4, 0, NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY),

('This forum is awesome! Much better than emailing TAs. 😄', 
3, 7, 0, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY);

-- Replies for Thread 4 (Study group)
INSERT INTO replies (content, thread_id, author_id, is_anonymous, created_at, updated_at) VALUES
('I\'m in! Been struggling with rotational motion. See you Saturday!', 
4, 7, 0, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR),

('Count me in too! Should we make a group chat?', 
4, 8, 0, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR);

-- Replies for Thread 6 (React useState)
INSERT INTO replies (content, thread_id, author_id, is_anonymous, created_at, updated_at) VALUES
('This is totally normal! React setState is asynchronous. The state won\'t update until the next render.

If you need the updated value immediately, use the functional update form:

```javascript
setCount(prevCount => prevCount + 1);
```

Or use useEffect to watch for changes:

```javascript
useEffect(() => {
  console.log(count); // This will show updated value
}, [count]);
```', 
6, 4, 0, NOW() - INTERVAL 4 HOUR, NOW() - INTERVAL 4 HOUR),

('Thanks @alice_nguyen! The useEffect approach worked perfectly. React is confusing sometimes 😅', 
6, 7, 0, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 3 HOUR);

-- Replies for Thread 7 (Chemistry - anonymous)
INSERT INTO replies (content, thread_id, author_id, is_anonymous, created_at, updated_at) VALUES
('No stupid questions here! For weak acid pH calculation:

1. Use ICE table: Ka = [H+][A-]/[HA]
2. Since [H+] = [A-], you get: Ka = [H+]²/(0.1 - [H+])
3. Assuming [H+] << 0.1, simplify to: [H+] = √(Ka × 0.1)
4. [H+] = √(1.8 × 10⁻⁵ × 0.1) = 1.34 × 10⁻³
5. pH = -log(1.34 × 10⁻³) ≈ 2.87

Always check if assumption is valid: 1.34 × 10⁻³ << 0.1 ✓', 
7, 6, 0, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 5 HOUR);

-- Replies for Thread 8 (Laptop discussion)
INSERT INTO replies (content, thread_id, author_id, is_anonymous, created_at, updated_at) VALUES
('I use a MacBook Air M3 and it\'s amazing! Battery lasts all day, super fast for coding, and can run multiple Docker containers no problem. The only downside is if you need Windows-specific software.', 
8, 4, 0, NOW() - INTERVAL 7 HOUR, NOW() - INTERVAL 7 HOUR),

('ThinkPad X1 Carbon user here! Love the keyboard, great for long coding sessions. Runs Linux perfectly. Not as flashy as MacBook but very reliable and professional.', 
8, 9, 0, NOW() - INTERVAL 6 HOUR, NOW() - INTERVAL 6 HOUR),

('Dell XPS 15 is solid but a bit heavy for daily carrying. Amazing screen though! Maybe consider XPS 13 if weight matters?', 
8, 8, 0, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 5 HOUR);

-- ============================================
-- 7. LINK THREADS TO TAGS
-- ============================================

-- Thread 1: JWT + Spring Boot + Java
INSERT INTO thread_tags (thread_id, tag_id) VALUES
(1, 1), -- java
(1, 5), -- spring-boot
(1, 7); -- web-dev

-- Thread 2: Math + Calculus + Homework
INSERT INTO thread_tags (thread_id, tag_id) VALUES
(2, 8),  -- math
(2, 9),  -- calculus
(2, 14); -- homework

-- Thread 6: React + JavaScript + Question
INSERT INTO thread_tags (thread_id, tag_id) VALUES
(6, 3),  -- javascript
(6, 4),  -- react
(6, 17); -- question

-- Thread 7: Chemistry + Homework + Urgent
INSERT INTO thread_tags (thread_id, tag_id) VALUES
(7, 11), -- chemistry
(7, 13), -- urgent
(7, 14); -- homework

-- Thread 8: Discussion
INSERT INTO thread_tags (thread_id, tag_id) VALUES
(8, 18); -- discussion

-- ============================================
-- 8. CREATE SAMPLE SUBSCRIPTIONS
-- ============================================

-- Users subscribe to threads they're interested in
INSERT INTO thread_subscriptions (user_id, thread_id, created_at) VALUES
(4, 1, NOW()), -- alice subscribed to JWT thread
(8, 1, NOW()), -- frank subscribed to JWT thread
(5, 2, NOW()), -- bob subscribed to calculus thread
(2, 2, NOW()), -- mod_john subscribed to calculus thread
(6, 4, NOW()), -- carol subscribed to study group
(7, 4, NOW()), -- david subscribed to study group
(8, 4, NOW()), -- emma subscribed to study group
(7, 6, NOW()), -- david subscribed to React thread
(4, 6, NOW()); -- alice subscribed to React thread

-- ============================================
-- 9. CREATE SAMPLE NOTIFICATIONS
-- ============================================

INSERT INTO notifications (user_id, type, title, message, link, is_read, created_at) VALUES
-- For alice (new reply to her thread)
(4, 'NEW_REPLY', 'New reply to your thread', 'frank_do replied to "How to implement JWT authentication in Spring Boot?"', '/thread/1', 0, NOW()),
(4, 'NEW_REPLY', 'New reply to your thread', 'mod_sarah replied to "How to implement JWT authentication in Spring Boot?"', '/thread/1', 1, NOW() - INTERVAL 1 HOUR),

-- For bob (new reply in subscribed thread)
(5, 'NEW_REPLY', 'New reply in subscribed thread', 'mod_john replied to "Need help with calculus integration problem"', '/thread/2', 0, NOW() - INTERVAL 1 HOUR),

-- For carol (study group responses)
(6, 'NEW_REPLY', 'Someone joined your study group', 'david_pham is interested in the Physics study group', '/thread/4', 0, NOW() - INTERVAL 2 HOUR),

-- Welcome notifications for new users
(7, 'SYSTEM', 'Welcome to the Forum!', 'Thanks for joining! Check out the pinned post for forum rules.', '/thread/3', 1, NOW() - INTERVAL 2 DAY);

-- ============================================
-- ✅ SEED DATA COMPLETE!
-- ============================================

-- Verify the data
SELECT 'Users created:' as Info, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Categories created:', COUNT(*) FROM categories
UNION ALL
SELECT 'Tags created:', COUNT(*) FROM tags
UNION ALL
SELECT 'Threads created:', COUNT(*) FROM threads
UNION ALL
SELECT 'Replies created:', COUNT(*) FROM replies
UNION ALL
SELECT 'Subscriptions created:', COUNT(*) FROM thread_subscriptions
UNION ALL
SELECT 'Notifications created:', COUNT(*) FROM notifications;

SELECT '✅ Database seed completed successfully!' as Status;
