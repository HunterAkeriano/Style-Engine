import { normalizePayload, stableStringify } from '../../utils/payloadNormalization';

describe('payloadNormalization', () => {
  describe('normalizePayload', () => {
    describe('gradient normalization', () => {
      it('should normalize valid gradient payload', () => {
        const payload = {
          type: 'linear',
          angle: 90,
          colors: [
            { color: '#FF0000', position: 0 },
            { color: '#00FF00', position: 100 }
          ]
        };

        const result = normalizePayload('gradient', payload);

        expect(result).toEqual({
          type: 'linear',
          angle: 90,
          colors: [
            { color: '#ff0000', position: 0 },
            { color: '#00ff00', position: 100 }
          ]
        });
      });

      it('should sort colors by position', () => {
        const payload = {
          colors: [
            { color: '#00FF00', position: 100 },
            { color: '#FF0000', position: 0 },
            { color: '#0000FF', position: 50 }
          ]
        };

        const result = normalizePayload('gradient', payload) as any;

        expect((result as any).colors).toEqual([
          { color: '#ff0000', position: 0 },
          { color: '#0000ff', position: 50 },
          { color: '#00ff00', position: 100 }
        ]);
      });

      it('should default type to linear if not provided', () => {
        const payload = { colors: [] };
        const result = normalizePayload('gradient', payload);
        expect(result.type).toBe('linear');
      });

      it('should normalize angle to number', () => {
        const payload = { angle: '45', colors: [] };
        const result = normalizePayload('gradient', payload);
        expect(result.angle).toBe(45);
      });

      it('should default angle to 0 if invalid', () => {
        const payload = { angle: 'invalid', colors: [] };
        const result = normalizePayload('gradient', payload);
        expect(result.angle).toBe(0);
      });

      it('should normalize color strings to lowercase', () => {
        const payload = {
          colors: [{ color: '#FFFFFF', position: 0 }]
        };
        const result = normalizePayload('gradient', payload);
        expect((result as any).colors[0].color).toBe('#ffffff');
      });

      it('should trim color strings', () => {
        const payload = {
          colors: [{ color: '  #FF0000  ', position: 0 }]
        };
        const result = normalizePayload('gradient', payload);
        expect((result as any).colors[0].color).toBe('#ff0000');
      });

      it('should handle empty colors array', () => {
        const payload = { colors: [] };
        const result = normalizePayload('gradient', payload);
        expect((result as any).colors).toEqual([]);
      });

      it('should handle missing colors field', () => {
        const payload = {};
        const result = normalizePayload('gradient', payload);
        expect((result as any).colors).toEqual([]);
      });

      it('should handle invalid color objects', () => {
        const payload = {
          colors: [{ invalid: 'data' }, null, undefined]
        };
        const result = normalizePayload('gradient', payload);
        expect((result as any).colors[0]).toEqual({ color: '', position: 0 });
      });
    });

    describe('shadow normalization', () => {
      it('should normalize valid shadow payload', () => {
        const payload = {
          layers: [
            {
              inset: false,
              x: 10,
              y: 20,
              blur: 30,
              spread: 5,
              color: '#000000'
            }
          ]
        };

        const result = normalizePayload('shadow', payload);

        expect(result).toEqual({
          layers: [
            {
              inset: false,
              x: 10,
              y: 20,
              blur: 30,
              spread: 5,
              color: '#000000'
            }
          ]
        });
      });

      it('should normalize layer numbers', () => {
        const payload = {
          layers: [
            {
              x: '10',
              y: '20',
              blur: '30',
              spread: '5',
              color: '#000'
            }
          ]
        };

        const result = normalizePayload('shadow', payload);

        expect((result as any).layers[0].x).toBe(10);
        expect((result as any).layers[0].y).toBe(20);
        expect((result as any).layers[0].blur).toBe(30);
        expect((result as any).layers[0].spread).toBe(5);
      });

      it('should convert inset to boolean', () => {
        const payload1 = {
          layers: [{ inset: true, x: 0, y: 0, blur: 0, spread: 0, color: '#000' }]
        };
        const result1 = normalizePayload('shadow', payload1);
        expect((result1 as any).layers[0].inset).toBe(true);

        const payload2 = {
          layers: [{ inset: false, x: 0, y: 0, blur: 0, spread: 0, color: '#000' }]
        };
        const result2 = normalizePayload('shadow', payload2);
        expect((result2 as any).layers[0].inset).toBe(false);

        const payload3 = {
          layers: [{ inset: 1, x: 0, y: 0, blur: 0, spread: 0, color: '#000' }]
        };
        const result3 = normalizePayload('shadow', payload3);
        expect((result3 as any).layers[0].inset).toBe(true);
      });

      it('should default color to #000 if empty', () => {
        const payload = {
          layers: [{ color: '' }]
        };

        const result = normalizePayload('shadow', payload);

        expect((result as any).layers[0].color).toBe('#000');
      });

      it('should normalize color to lowercase', () => {
        const payload = {
          layers: [{ color: '#FF0000' }]
        };

        const result = normalizePayload('shadow', payload);

        expect((result as any).layers[0].color).toBe('#ff0000');
      });

      it('should handle empty layers array', () => {
        const payload = { layers: [] };
        const result = normalizePayload('shadow', payload);
        expect((result as any).layers).toEqual([]);
      });

      it('should handle missing layers field', () => {
        const payload = {};
        const result = normalizePayload('shadow', payload);
        expect((result as any).layers).toEqual([]);
      });

      it('should sort layers consistently', () => {
        const payload = {
          layers: [
            { x: 20, y: 20, color: '#fff' },
            { x: 10, y: 10, color: '#000' }
          ]
        };

        const result = normalizePayload('shadow', payload);

        expect((result as any).layers.length).toBe(2);
      });

      it('should handle invalid number values', () => {
        const payload = {
          layers: [
            {
              x: 'invalid',
              y: NaN,
              blur: Infinity,
              spread: null
            }
          ]
        };

        const result = normalizePayload('shadow', payload);

        expect((result as any).layers[0].x).toBe(0);
        expect((result as any).layers[0].y).toBe(0);
        expect((result as any).layers[0].blur).toBe(0);
        expect((result as any).layers[0].spread).toBe(0);
      });
    });

    describe('animation normalization', () => {
      it('should normalize valid animation payload', () => {
        const payload = {
          html: '<div>Test</div>',
          css: '.test { color: red; }'
        };

        const result = normalizePayload('animation', payload);

        expect(result).toEqual({
          html: '<div>Test</div>',
          css: '.test { color: red; }'
        });
      });

      it('should trim HTML and CSS', () => {
        const payload = {
          html: '  <div>Test</div>  ',
          css: '  .test { color: red; }  '
        };

        const result = normalizePayload('animation', payload);

        expect(result.html).toBe('<div>Test</div>');
        expect(result.css).toBe('.test { color: red; }');
      });

      it('should default HTML to empty string if not provided', () => {
        const payload = { css: '.test {}' };
        const result = normalizePayload('animation', payload);
        expect(result.html).toBe('');
      });

      it('should default CSS to empty string if not provided', () => {
        const payload = { html: '<div></div>' };
        const result = normalizePayload('animation', payload);
        expect(result.css).toBe('');
      });

      it('should handle non-string values', () => {
        const payload = {
          html: 123,
          css: null
        };

        const result = normalizePayload('animation', payload);

        expect(result.html).toBe('');
        expect(result.css).toBe('');
      });
    });

    describe('clip-path normalization', () => {
      it('should normalize polygon layer', () => {
        const payload = {
          layers: [
            {
              id: 'layer1',
              type: 'polygon',
              visible: true,
              points: [
                { id: 'p1', x: 10, y: 20 },
                { id: 'p2', x: 30, y: 40 }
              ]
            }
          ]
        };

        const result = normalizePayload('clip-path', payload);

        expect((result as any).layers[0]).toEqual({
          id: 'layer1',
          type: 'polygon',
          visible: true,
          points: [
            { id: 'p1', x: 10, y: 20 },
            { id: 'p2', x: 30, y: 40 }
          ]
        });
      });

      it('should sort points by id', () => {
        const payload = {
          layers: [
            {
              type: 'polygon',
              points: [
                { id: 'p3', x: 50, y: 60 },
                { id: 'p1', x: 10, y: 20 },
                { id: 'p2', x: 30, y: 40 }
              ]
            }
          ]
        };

        const result = normalizePayload('clip-path', payload);

        expect((result as any).layers[0].points[0].id).toBe('p1');
        expect((result as any).layers[0].points[1].id).toBe('p2');
        expect((result as any).layers[0].points[2].id).toBe('p3');
      });

      it('should normalize circle layer', () => {
        const payload = {
          layers: [
            {
              id: 'circle1',
              type: 'circle',
              visible: true,
              radius: 50
            }
          ]
        };

        const result = normalizePayload('clip-path', payload);

        expect((result as any).layers[0]).toEqual({
          id: 'circle1',
          type: 'circle',
          visible: true,
          radius: 50
        });
      });

      it('should normalize ellipse layer', () => {
        const payload = {
          layers: [
            {
              id: 'ellipse1',
              type: 'ellipse',
              visible: true,
              radiusX: 50,
              radiusY: 30
            }
          ]
        };

        const result = normalizePayload('clip-path', payload);

        expect((result as any).layers[0]).toEqual({
          id: 'ellipse1',
          type: 'ellipse',
          visible: true,
          radiusX: 50,
          radiusY: 30
        });
      });

      it('should normalize inset layer', () => {
        const payload = {
          layers: [
            {
              id: 'inset1',
              type: 'inset',
              visible: true,
              inset: {
                top: 10,
                right: 20,
                bottom: 30,
                left: 40,
                round: 5
              }
            }
          ]
        };

        const result = normalizePayload('clip-path', payload);

        expect((result as any).layers[0]).toEqual({
          id: 'inset1',
          type: 'inset',
          visible: true,
          inset: {
            top: 10,
            right: 20,
            bottom: 30,
            left: 40,
            round: 5
          }
        });
      });

      it('should default layer type to polygon', () => {
        const payload = {
          layers: [{ id: 'layer1' }]
        };

        const result = normalizePayload('clip-path', payload);

        expect((result as any).layers[0].type).toBe('polygon');
      });

      it('should convert visible to boolean', () => {
        const payload = {
          layers: [
            { visible: 1 },
            { visible: 0 },
            { visible: 'true' }
          ]
        };

        const result = normalizePayload('clip-path', payload);

        expect((result as any).layers[0].visible).toBe(true);
        expect((result as any).layers[1].visible).toBe(false);
        expect((result as any).layers[2].visible).toBe(true);
      });

      it('should sort layers by id', () => {
        const payload = {
          layers: [
            { id: 'layer3', type: 'circle' },
            { id: 'layer1', type: 'polygon' },
            { id: 'layer2', type: 'ellipse' }
          ]
        };

        const result = normalizePayload('clip-path', payload);

        expect((result as any).layers[0].id).toBe('layer1');
        expect((result as any).layers[1].id).toBe('layer2');
        expect((result as any).layers[2].id).toBe('layer3');
      });

      it('should handle empty layers array', () => {
        const payload = { layers: [] };
        const result = normalizePayload('clip-path', payload);
        expect((result as any).layers).toEqual([]);
      });

      it('should handle missing layers field', () => {
        const payload = {};
        const result = normalizePayload('clip-path', payload);
        expect((result as any).layers).toEqual([]);
      });

      it('should handle invalid point values', () => {
        const payload = {
          layers: [
            {
              type: 'polygon',
              points: [
                { x: 'invalid', y: null }
              ]
            }
          ]
        };

        const result = normalizePayload('clip-path', payload);

        expect((result as any).layers[0].points[0].x).toBe(0);
        expect((result as any).layers[0].points[0].y).toBe(0);
      });
    });

    describe('general cases', () => {
      it('should return empty object for null payload', () => {
        const result = normalizePayload('gradient', null);
        expect(result).toEqual({});
      });

      it('should return empty object for undefined payload', () => {
        const result = normalizePayload('gradient', undefined);
        expect(result).toEqual({});
      });

      it('should return empty object for non-object payload', () => {
        const result = normalizePayload('gradient', 'invalid');
        expect(result).toEqual({});
      });

      it('should return payload as-is for unknown category', () => {
        const payload = { custom: 'data' };
        const result = normalizePayload('favicon' as any, payload);
        expect(result).toEqual(payload);
      });
    });
  });

  describe('stableStringify', () => {
    it('should stringify null', () => {
      expect(stableStringify(null)).toBe('null');
    });

    it('should stringify undefined', () => {
      expect(stableStringify(undefined)).toBe('undefined');
    });

    it('should stringify strings', () => {
      expect(stableStringify('test')).toBe('"test"');
    });

    it('should stringify numbers', () => {
      expect(stableStringify(42)).toBe('42');
      expect(stableStringify(3.14)).toBe('3.14');
    });

    it('should stringify booleans', () => {
      expect(stableStringify(true)).toBe('true');
      expect(stableStringify(false)).toBe('false');
    });

    it('should stringify arrays', () => {
      expect(stableStringify([1, 2, 3])).toBe('[1,2,3]');
      expect(stableStringify(['a', 'b'])).toBe('["a","b"]');
    });

    it('should stringify objects with sorted keys', () => {
      const obj = { c: 3, a: 1, b: 2 };
      expect(stableStringify(obj)).toBe('{a:1,b:2,c:3}');
    });

    it('should handle nested objects', () => {
      const obj = { b: { y: 2, x: 1 }, a: 1 };
      expect(stableStringify(obj)).toBe('{a:1,b:{x:1,y:2}}');
    });

    it('should handle nested arrays', () => {
      const arr = [[3, 2, 1], [6, 5, 4]];
      expect(stableStringify(arr)).toBe('[[3,2,1],[6,5,4]]');
    });

    it('should handle mixed nested structures', () => {
      const data = {
        b: [2, 1],
        a: { z: 26, y: 25 }
      };
      expect(stableStringify(data)).toBe('{a:{y:25,z:26},b:[2,1]}');
    });

    it('should handle circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      const result = stableStringify(obj);
      expect(result).toContain('[Circular]');
    });

    it('should handle empty objects', () => {
      expect(stableStringify({})).toBe('{}');
    });

    it('should handle empty arrays', () => {
      expect(stableStringify([])).toBe('[]');
    });

    it('should produce same result for objects with same keys in different order', () => {
      const obj1 = { a: 1, b: 2, c: 3 };
      const obj2 = { c: 3, a: 1, b: 2 };
      expect(stableStringify(obj1)).toBe(stableStringify(obj2));
    });

    it('should handle arrays with objects', () => {
      const arr = [{ b: 2, a: 1 }, { d: 4, c: 3 }];
      expect(stableStringify(arr)).toBe('[{a:1,b:2},{c:3,d:4}]');
    });

    it('should handle special number values', () => {
      expect(stableStringify(0)).toBe('0');
      expect(stableStringify(-1)).toBe('-1');
      expect(stableStringify(Infinity)).toBe('null');
      expect(stableStringify(-Infinity)).toBe('null');
      expect(stableStringify(NaN)).toBe('null');
    });
  });
});
