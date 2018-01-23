import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tec-yaml-tree',
  templateUrl: './yaml-tree.component.html',
  styleUrls: ['./yaml-tree.component.sass'],
})
export class YamlTreeComponent implements OnInit {
  @Input() treeModel: string;
  @Input() treeLevel: number;

  constructor(
  ) {
  }

  ngOnInit() {
  }

  toggle(node) {
    node.expanded = !node.expanded;
  }
}
