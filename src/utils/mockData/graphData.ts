import { keywordsData } from "./keywordData";

interface GraphNode {
  id: string;
  label: string;
  type: string;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

// 生成知识图谱数据的辅助函数
export const generateKnowledgeGraphData = () => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // 添加关键词节点
  keywordsData.forEach(keyword => {
    nodes.push({
      id: `keyword-${keyword.id}`,
      label: keyword.keyword,
      type: 'keyword'
    });

    // 添加关联关系
    keyword.relatedKeywords.forEach((relatedId: number) => {
      links.push({
        source: `keyword-${keyword.id}`,
        target: `keyword-${relatedId}`,
        value: 1
      });
    });
  });

  return { nodes, links };
};
