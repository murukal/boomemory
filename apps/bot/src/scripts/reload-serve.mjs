#!/usr/bin/env zx

// 清除pm2日志
await $`pm2 flush`;

// 重启服务端所有服务
await $`pm2 restart all`;
