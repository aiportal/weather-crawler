import {NodeModuleTester} from './core/utils';

/**
 * main 入口
 */
function main() {
  const tester = new NodeModuleTester("s1", 1);

  console.log(NodeModuleTester.STATIC_VAR);

  console.log(NodeModuleTester.testPath());

  console.log('测试');
}

main();
