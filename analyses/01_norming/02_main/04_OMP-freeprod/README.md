CI: object naming analysis
================

### About the participants (after exclusion)

![](analysis_files/figure-markdown_github/subj-1.png)

Object descriptions
-------------------

#### Color diagnostic objects

"other" utterances: swan is often called a goose; two people identified the white carrot as parsnip

![](analysis_files/figure-markdown_github/cd%20objects-1.png)

#### Non-color diagnostic objects

"other" utterances: mug is still often called a cup; jacket is often called "coat"

![](analysis_files/figure-markdown_github/non-cd%20objects-1.png)

### In-participant variability

``` r
df_part = df_plot %>% 
  filter(ref_used)

ggplot(df_part,aes(x=trial_number,y=ref_cat)) +
  facet_wrap(vars(anon_worker_id)) +
  geom_point()
```

![](analysis_files/figure-markdown_github/unnamed-chunk-1-1.png)
