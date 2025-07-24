"use strict";
// 认证API路由
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../services/auth");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
// 用户登录
router.post('/login', async (req, res, next) => {
    try {
        const credentials = req.body;
        // 基础验证
        if (!credentials.username || !credentials.password) {
            return res.status(400).json({
                success: false,
                error: '用户名和密码不能为空'
            });
        }
        const result = await auth_1.authService.login(credentials);
        res.json({
            success: true,
            data: result,
            message: '登录成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Login API error:', error);
        next(error);
    }
});
// 用户注册
router.post('/register', async (req, res, next) => {
    try {
        const userData = req.body;
        // 基础验证
        if (!userData.username || !userData.email || !userData.password) {
            return res.status(400).json({
                success: false,
                error: '用户名、邮箱和密码不能为空'
            });
        }
        if (userData.password !== userData.confirm_password) {
            return res.status(400).json({
                success: false,
                error: '密码和确认密码不匹配'
            });
        }
        const result = await auth_1.authService.register(userData);
        res.status(201).json({
            success: true,
            data: result,
            message: '注册成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Register API error:', error);
        next(error);
    }
});
// 刷新令牌
router.post('/refresh', async (req, res, next) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            return res.status(400).json({
                success: false,
                error: '刷新令牌不能为空'
            });
        }
        const result = await auth_1.authService.refreshToken(refresh_token);
        res.json({
            success: true,
            data: result,
            message: '令牌刷新成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Refresh token API error:', error);
        next(error);
    }
});
// 用户登出
router.post('/logout', async (req, res, next) => {
    try {
        await auth_1.authService.logout();
        res.json({
            success: true,
            message: '登出成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Logout API error:', error);
        next(error);
    }
});
// 获取当前用户信息
router.get('/me', async (req, res, next) => {
    try {
        const user = await auth_1.authService.getCurrentUser();
        res.json({
            success: true,
            data: user,
            message: '获取用户信息成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Get current user API error:', error);
        next(error);
    }
});
// 验证令牌
router.get('/validate', async (req, res, next) => {
    try {
        const isValid = await auth_1.authService.validateToken();
        res.json({
            success: true,
            data: { valid: isValid },
            message: isValid ? '令牌有效' : '令牌无效'
        });
    }
    catch (error) {
        logger_1.logger.error('Validate token API error:', error);
        next(error);
    }
});
// 修改密码
router.post('/change-password', async (req, res, next) => {
    try {
        const passwordData = req.body;
        if (!passwordData.current_password || !passwordData.new_password) {
            return res.status(400).json({
                success: false,
                error: '当前密码和新密码不能为空'
            });
        }
        if (passwordData.new_password !== passwordData.confirm_password) {
            return res.status(400).json({
                success: false,
                error: '新密码和确认密码不匹配'
            });
        }
        await auth_1.authService.changePassword(passwordData);
        res.json({
            success: true,
            message: '密码修改成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Change password API error:', error);
        next(error);
    }
});
// 密码重置请求
router.post('/reset-password', async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                error: '邮箱不能为空'
            });
        }
        await auth_1.authService.requestPasswordReset(email);
        res.json({
            success: true,
            message: '密码重置邮件已发送'
        });
    }
    catch (error) {
        logger_1.logger.error('Password reset request API error:', error);
        next(error);
    }
});
// 确认密码重置
router.post('/reset-password/confirm', async (req, res, next) => {
    try {
        const resetData = req.body;
        if (!resetData.token || !resetData.new_password) {
            return res.status(400).json({
                success: false,
                error: '重置令牌和新密码不能为空'
            });
        }
        if (resetData.new_password !== resetData.confirm_password) {
            return res.status(400).json({
                success: false,
                error: '新密码和确认密码不匹配'
            });
        }
        await auth_1.authService.confirmPasswordReset(resetData);
        res.json({
            success: true,
            message: '密码重置成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Password reset confirm API error:', error);
        next(error);
    }
});
// 用户资料管理
router.get('/profile', async (req, res, next) => {
    try {
        const profile = await auth_1.authService.getUserProfile();
        res.json({
            success: true,
            data: profile,
            message: '获取用户资料成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Get user profile API error:', error);
        next(error);
    }
});
router.put('/profile', async (req, res, next) => {
    try {
        const profileData = req.body;
        const updatedProfile = await auth_1.authService.updateUserProfile(profileData);
        res.json({
            success: true,
            data: updatedProfile,
            message: '更新用户资料成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Update user profile API error:', error);
        next(error);
    }
});
// 用户设置管理
router.get('/settings', async (req, res, next) => {
    try {
        const settings = await auth_1.authService.getUserSettings();
        res.json({
            success: true,
            data: settings,
            message: '获取用户设置成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Get user settings API error:', error);
        next(error);
    }
});
router.put('/settings', async (req, res, next) => {
    try {
        const settingsData = req.body;
        const updatedSettings = await auth_1.authService.updateUserSettings(settingsData);
        res.json({
            success: true,
            data: updatedSettings,
            message: '更新用户设置成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Update user settings API error:', error);
        next(error);
    }
});
// 用户偏好管理
router.get('/preferences', async (req, res, next) => {
    try {
        const preferences = await auth_1.authService.getUserPreferences();
        res.json({
            success: true,
            data: preferences,
            message: '获取用户偏好成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Get user preferences API error:', error);
        next(error);
    }
});
router.put('/preferences', async (req, res, next) => {
    try {
        const preferencesData = req.body;
        const updatedPreferences = await auth_1.authService.updateUserPreferences(preferencesData);
        res.json({
            success: true,
            data: updatedPreferences,
            message: '更新用户偏好成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Update user preferences API error:', error);
        next(error);
    }
});
// 获取用户权限
router.get('/permissions', async (req, res, next) => {
    try {
        const permissions = await auth_1.authService.getUserPermissions();
        res.json({
            success: true,
            data: { permissions },
            message: '获取用户权限成功'
        });
    }
    catch (error) {
        logger_1.logger.error('Get user permissions API error:', error);
        next(error);
    }
});
exports.default = router;
