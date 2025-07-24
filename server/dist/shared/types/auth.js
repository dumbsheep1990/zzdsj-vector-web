"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLevel = exports.ResourceType = void 0;
// 资源权限
var ResourceType;
(function (ResourceType) {
    ResourceType["KNOWLEDGE_BASE"] = "knowledge_base";
    ResourceType["ASSISTANT"] = "assistant";
    ResourceType["DATASET"] = "dataset";
    ResourceType["MCP_CONFIG"] = "mcp_config";
    ResourceType["VECTOR"] = "vector";
    ResourceType["TOOL"] = "tool";
    ResourceType["GRAPH"] = "graph";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
var AccessLevel;
(function (AccessLevel) {
    AccessLevel["READ"] = "read";
    AccessLevel["WRITE"] = "write";
    AccessLevel["ADMIN"] = "admin";
    AccessLevel["OWNER"] = "owner";
})(AccessLevel || (exports.AccessLevel = AccessLevel = {}));
