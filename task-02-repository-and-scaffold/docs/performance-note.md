**Performance Note**

1. Distance from a Reasonable Target
• First load time: 11,920 ms.
• Reasonable target: Under 200 ms.
• The gap: About 11,720 ms slower.

2. What Accounts for the Gap
The massive delay is caused by on-demand compilation.
When you first open the page, your development tool has to read, process, and build multiple code files all at the exact same time.
The second request drops to just 209 ms because all files are already built and stored in memory, allowing the computer to show the page instantly.